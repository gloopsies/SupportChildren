package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"mime/multipart"
	"net/http"
	"net/smtp"
	"strconv"
	"strings"
	"time"

	. "back/config"
	"back/database"
	. "back/log"

	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	"github.com/google/uuid"
)

var ctx = context.Background()
var redisClient *redis.Client

type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func login(context *gin.Context) {
	body, err := ioutil.ReadAll(context.Request.Body)
	if err != nil {
		Log(err)
		context.String(http.StatusInternalServerError, "Error reading request")
		return
	}

	var user User
	err = json.Unmarshal(body, &user)
	if err != nil {
		Log(err)
		context.String(http.StatusBadRequest, "Can't parse request")
		return
	}

	if user.Username == Config.Login.Username && user.Password == Config.Login.Password {
		var UUID = uuid.NewString()
		redisClient.Set(ctx, UUID, "", 30*time.Minute)
		http.SetCookie(context.Writer, &http.Cookie{
			Name:     "session",
			Value:    UUID,
			MaxAge:   30 * 60,
			Path:     "/",
			Domain:   Config.Host,
			Secure:   true,
			HttpOnly: true,
			SameSite: http.SameSiteNoneMode,
		})
		context.String(http.StatusOK, "User logged in")
		return
	} else {
		context.String(http.StatusUnauthorized, "Incorrect username or password")
		return
	}
}

func isAuth(context *gin.Context) {
	cookie, err := context.Cookie("session")
	if err != nil {
		Log(err)
		context.AbortWithStatusJSON(http.StatusUnauthorized, "User not logged in")
		return
	}

	_, err = redisClient.Get(ctx, cookie).Result()
	if err != nil {
		Log(err)
		context.AbortWithStatusJSON(http.StatusUnauthorized, "User not logged in")
		return
	}
}

func loggedIn(context *gin.Context) {
	context.String(http.StatusOK, "User logged in")
}

func imgExt(filename string) (string, error) {
	pos := strings.LastIndex(filename, ".")
	if pos == -1 {
		return "", errors.New("filename has no extension")
	}

	return filename[pos:], nil
}

func newFundraiser(context *gin.Context) {
	var err error
	var fundraiser database.Fundraiser

	fundraiser.Name = context.PostForm("name")

	var img *multipart.FileHeader
	img, err = context.FormFile("image")
	if err != nil {
		context.String(http.StatusBadRequest, "error reading file")
		return
	}
	var ext string
	ext, err = imgExt(img.Filename)
	fundraiser.Image = fmt.Sprintf("%s%s", uuid.NewString(), ext)
	if err := context.SaveUploadedFile(img, Config.Images.Local+fundraiser.Image); err != nil {
		Log(err)
		context.String(http.StatusBadRequest, "upload file error")
		return
	}

	fundraiser.Description = context.PostForm("description")

	fundraiser.EndDate, err = time.Parse("2006-01-02", context.PostForm("end_date"))
	if err != nil {
		Log(err)
		context.String(http.StatusBadRequest, "error parsing date")
		return
	}

	fundraiser.Goal = context.PostForm("goal")
	fundraiser.RecipientAddress = context.PostForm("recipient_address")
	fundraiser.ContractAddress = context.PostForm("contract_address")
	fundraiser.Category, err = strconv.Atoi(context.PostForm("category"))
	if err != nil {
		Log(err)
		context.String(http.StatusInternalServerError, "option must be a number")
		return
	}

	err = database.AddFundraiser(fundraiser)
	if err != nil {
		Log(err)
		context.String(http.StatusInternalServerError, "error adding to the database")
		return
	}

	context.String(http.StatusOK, "added to the database")
}

func showFundraisers(context *gin.Context) {
	f, err := database.Fundraisers()

	for i, fundraiser := range f {
		fundraiser.Image = Config.Images.Local + fundraiser.Image
		if fundraiser.EndDate.Before(time.Now()) {
			err = database.FundraiserDone(fundraiser.ContractAddress)
			if err != nil {
				context.String(http.StatusInternalServerError, "error reading database")
			}
			f = append(f[:i], f[i+1:]...)
		}
	}

	if err != nil {
		Log(err)
		context.String(http.StatusInternalServerError, "error reading database")
		return
	}

	context.JSON(200, f)
}

func redisInit() {
	redisClient = redis.NewClient(&redis.Options{
		Addr:     Config.Redis.Host,
		Password: Config.Redis.Password,
	})
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", Config.CORS)
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}

func logOut(context *gin.Context) {
	http.SetCookie(context.Writer, &http.Cookie{
		Name:     "session",
		Value:    "",
		MaxAge:   0,
		Path:     "/",
		Domain:   Config.Host,
		Secure:   true,
		HttpOnly: true,
		SameSite: http.SameSiteNoneMode,
	})
	context.String(http.StatusOK, "Logged out")
}

func sendMail(to []string, subject string, body string) error {
	from := Config.Mail.Mail
	password := Config.Mail.Password

	smtpHost := Config.Mail.SMTPHost
	smtpPort := Config.Mail.SMTPPort

	auth := smtp.PlainAuth("", from, password, smtpHost)

	if len(to) > 0 {
		err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, to, []byte("Subject: " + subject + "\r\n" +body))
		if err != nil {
			return err
		}
	}

	return nil
}

func transaction(context *gin.Context) {
	body, err := ioutil.ReadAll(context.Request.Body)
	if err != nil {
		Log(err)
		context.String(http.StatusInternalServerError, "Error reading request")
		return
	}

	var subscription database.TransactionT
	err = json.Unmarshal(body, &subscription)
	if err != nil {
		Log(err)
		context.String(http.StatusBadRequest, "Can't parse request")
		return
	}

	err = database.AddTransaction(subscription)
	if err != nil {
		Log(err)
		context.String(http.StatusInternalServerError, "Error adding to database")
		return
	}

	fundraiserName, err := database.GetFundraiserName(subscription.Fundraiser)
	if err != nil {
		Log(err)
		context.String(http.StatusInternalServerError, "Error reading database")
		return
	}

	to, err := database.GetMails(subscription.Fundraiser)
	subject := "Your donation was successful"
	message := "Hello,\n\n" +
		"We would like to inform You that your donation for " + fundraiserName + " is successful.\n\n" +
		"You can see your transaction https://rinkeby.etherscan.io/tx/"+ subscription.Transaction +"\n\n" +
		"Thank you for donation!\n" +
		"Sincerely,\n" +
		"Support Children."
	err = sendMail(to, subject, message)
	if err != nil {
		Log(err)
		context.String(http.StatusInternalServerError, "Error sending emails")
		return
	}

	to = Config.Mail.AdminMail
	subject = "You received donation"
	message = "Hello,\n\n" +
		"We would like to inform You that you have received donation for " + fundraiserName + ".\n\n" +
		"You can see this transaction at: https://rinkeby.etherscan.io/tx/"+ subscription.Transaction +"\n\n" +
		"Sincerely,\n" +
		"Support Children."
	err = sendMail(to, subject, message)
	if err != nil {
		Log(err)
		context.String(http.StatusInternalServerError, "Error sending emails")
		return
	}

	context.String(http.StatusOK, "ok")
}

func done(context *gin.Context) {
	body, err := ioutil.ReadAll(context.Request.Body)
	if err != nil {
		Log(err)
		context.String(http.StatusInternalServerError, "Error reading request")
		return
	}

	id := string(body)

	err = database.FundraiserDone(id)
	if err != nil {
		Log(err)
		context.String(http.StatusInternalServerError, "Error removing data from the database")
	}

	to, err := database.GetMails(id)
	if err != nil {
		Log(err)
		context.String(http.StatusInternalServerError, "Error reading from database")
		return
	}

	fundraiserName, err := database.GetFundraiserName(id)
	if err != nil {
		Log(err)
		context.String(http.StatusInternalServerError, "Error reading database")
		return
	}

	subject := "Fundraiser campaign completed"
	message := "Hello,\n\n" +
		"We would like to inform You that the " + fundraiserName + " is completed and money will be transacted to recipient.\n\n" +
		"Thank you for donation!\n\n" +
		"Sincerely,\n" +
		"Support Children."
	err = sendMail(to, subject, message)
	if err != nil {
		Log(err)
		context.String(http.StatusInternalServerError, "Error sending emails")
		return
	}

	to = Config.Mail.AdminMail
	subject = "Fundraiser campaign completed"
	message = "Fundraiser " + fundraiserName + " is completed!"
	err = sendMail(to, subject, message)
	if err != nil {
		Log(err)
		context.String(http.StatusInternalServerError, "Error sending emails")
		return
	}

	context.String(http.StatusOK, "ok")
}

func getTransactions(context *gin.Context) {
	transactions, err := database.GetTransactions()
	if err != nil {
		Log(err)
		context.String(http.StatusInternalServerError, "Error reading from database")
		return
	}

	context.JSON(http.StatusOK, transactions)
}

func main() {
	var err error
	err = ReadConfig()
	if err != nil {
		Log(err)
		return
	}

	redisInit()
	err = database.DBConnect()
	if err != nil {
		Log(err)
		return
	}

	if Config.Debug {
		gin.SetMode(gin.DebugMode)
	} else {
		gin.SetMode(gin.ReleaseMode)
	}

	server := gin.Default()

	server.Use(CORSMiddleware())
	server.POST("/login", login)
	server.POST("/logout", isAuth, logOut)
	server.POST("/logged", isAuth, loggedIn)
	server.POST("/transaction", transaction)
	server.POST("/done", done)
	server.POST("/fundraiser", isAuth, newFundraiser)
	server.GET("/fundraisers", showFundraisers)
	server.GET("/transactions", getTransactions)

	server.Static(Config.Images.Serve, Config.Images.Local)

	err = server.Run(":" + Config.Port)

	if err != nil {
		Log(err)
	}
}
