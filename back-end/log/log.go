package log

import (
	. "back/config"
	"fmt"
	"os"
	"time"
)

func Log(err error) {
	errMsg := fmt.Sprintf("%s\t\t%s", time.Now().Format("2006-01-02 3:4:5"), err.Error())
	if len(Config.LogFile) == 0 {
		fmt.Println(errMsg)
		return
	}

	file, e := os.OpenFile(Config.LogFile, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if e != nil {
		fmt.Println("Error opening log file! Error:")
		fmt.Println(errMsg)
		return
	}

	_, e = file.WriteString(errMsg + "\n")
	if e != nil {
		fmt.Println("Error writing to log file! Error:")
		fmt.Println(errMsg)
		return
	}
	_ = file.Close()
}
