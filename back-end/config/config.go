package config

import (
	"encoding/json"
	"io/ioutil"
)

var (
	Config conf
)

type conf struct {
	Db struct {
		Username string `json:"username"`
		Password string `json:"password"`
		Host     string `json:"host"`
		Port     string `json:"port"`
		Name     string `json:"name"`
	} `json:"database"`
	Port  string `json:"port"`
	Login struct {
		Username string `json:"username"`
		Password string `json:"password"`
	} `json:"login"`
	Redis struct {
		Host     string `json:"host"`
		Password string `json:"password"`
	} `json:"redis"`
	Images struct {
		Local string `json:"local"`
		Serve string `json:"serve"`
	} `json:"images"`
	Mail struct {
		Mail      string   `json:"email"`
		Password  string   `json:"password"`
		SMTPHost  string   `json:"smtp_host"`
		SMTPPort  string   `json:"smtp_port"`
		AdminMail []string `json:"admin_mail"`
	} `json:"email"`
	Host string `json:"host"`
	CORS string `json:"cors"`
	LogFile string `json:"log_file"`
	Debug   bool   `json:"debug"`
}

func ReadConfig() error {
	data, err := ioutil.ReadFile("./config.json")
	if err != nil {
		return err
	}
	err = json.Unmarshal(data, &Config)

	return err
}
