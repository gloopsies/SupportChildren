package database

import (
	"database/sql"
	"fmt"
	"time"

	_ "github.com/lib/pq"

	. "back/config"
)

var (
	db *sql.DB
)

type Fundraiser struct {
	ID               int       `json:"id"`
	Name             string    `json:"name"`
	Image            string    `json:"image"`
	Description      string    `json:"description"`
	EndDate          time.Time `json:"end_date"`
	Goal             string    `json:"goal"`
	RecipientAddress string    `json:"recipient_address"`
	ContractAddress  string    `json:"contract_address"`
	Category         int       `json:"category"`
	CreatedAt        time.Time `json:"created_at"`
}

func DBConnect() error {
	var err error
	psqlInfo := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		Config.Db.Host, Config.Db.Port, Config.Db.Username, Config.Db.Password, Config.Db.Name)

	db, err = sql.Open("postgres", psqlInfo)
	if err != nil {
		return err
	}

	err = db.Ping()
	if err != nil {
		return err
	}

	return nil
}

func Fundraisers() ([]Fundraiser, error) {
	var err error

	rows, err := db.Query("SELECT id, name, image, description, end_date, goal, recipient_address, contract_address, category, createdAt FROM fundraisers where done = false")

	if err != nil {
		return nil, err
	}
	var f []Fundraiser
	for rows.Next() {
		var fund Fundraiser
		err = rows.Scan(&fund.ID, &fund.Name, &fund.Image, &fund.Description, &fund.EndDate, &fund.Goal, &fund.RecipientAddress, &fund.ContractAddress, &fund.Category, &fund.CreatedAt)
		if err != nil {
			return nil, err
		}
		f = append(f, fund)
	}

	err = rows.Close()
	if err != nil {
		return nil, err
	}

	return f, err
}

func AddFundraiser(f Fundraiser) error {
	var err error

	_, err = db.Exec(
		"INSERT INTO fundraisers(name, image, description, end_date, goal, recipient_address, contract_address, category) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
		f.Name, f.Image, f.Description, f.EndDate.Format("2006-01-02"), f.Goal, f.RecipientAddress, f.ContractAddress, f.Category,
	)

	return err
}

func GetFundraiserName(contractAddress string) (string, error) {
	var err error
	var name string

	row := db.QueryRow("SELECT name FROM fundraisers WHERE contract_address = $1", contractAddress)
	err = row.Scan(&name)

	return name, err
}

func FundraiserDone(fId string) error {
	var err error

	_, err = db.Exec("select fundraiser_done($1);", fId)

	return err
}

type TransactionT struct {
	Value string `json:"value"`
	Email      string `json:"email"`
	Fundraiser string `json:"fundraiser"`
	Transaction string `json:"transaction"`
}

func AddTransaction(subscribe TransactionT) error {
	var err error

	_, err = db.Exec(
		"INSERT INTO donations(value, email, fundraiser, transaction) VALUES ($1, $2, (SELECT id FROM fundraisers WHERE contract_address = $3), $4)",
		subscribe.Value, subscribe.Email, subscribe.Fundraiser, subscribe.Transaction,
	)

	return err
}

type GetTransactionT = struct {
	Value 		string `json:"value"`
	CreatedAt time.Time `json:"created_at"`
	Email      string `json:"email"`
	Fundraiser string `json:"fundraiser"`
	Transaction string `json:"transaction"`
}

func GetTransactions() ([]GetTransactionT, error) {
	var err error
	var transactions []GetTransactionT

	rows, err := db.Query("SELECT value, donations.createdAt, email, name, transaction FROM donations, fundraisers WHERE donations.fundraiser = fundraisers.id")
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		var transaction GetTransactionT
		err = rows.Scan(&transaction.Value, &transaction.CreatedAt, &transaction.Email, &transaction.Fundraiser, &transaction.Transaction)
		if err != nil {
			return nil, err
		}
		transactions = append(transactions, transaction)
	}

	return transactions, err
}

func GetMails(id string) ([]string, error) {
	var err error

	rows, err := db.Query("SELECT DISTINCT email FROM donations, fundraisers WHERE fundraiser = fundraisers.id AND contract_address = $1 AND email is not null", id)
	if err != nil {
		return nil, err
	}

	var emails []string

	for rows.Next() {
		var email string
		err = rows.Scan(&email)
		if err != nil {
			return nil, err
		}
		emails = append(emails, email)
	}

	return emails, nil
}