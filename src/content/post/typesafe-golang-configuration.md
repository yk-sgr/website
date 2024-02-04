---
author: Yannick Seeger
publishDate: 2020-11-11T10:11:24+02:00
title: Typesafe Golang Configuration
featured: false
draft: false
tags:
  - go
  - golang
ogImage: ""
description: How to configure your Go applications typesafe with environment variables.
---

As a developer, I've experimented with various configuration formats over the years, including JSON, YAML, and properties files, among others. However, in recent times, I find myself increasingly relying on **environment variables** to manage configuration values.

In today's cloud-centric world, where stateless services are the norm, environment variables are an excellent fit, especially when working with containerization technologies like Docker or Kubernetes.

To simplify the code for loading configurations and ensure type safety, I use two Go packages, namely [godotenv](https://github.com/joho/godotenv) and [envconfig](https://github.com/kelseyhightower/envconfig).

- godotenv is a package that loads .env files if they exist. This is useful in local development environments, where you may not want to store sensitive configuration data in code.
- envconfig, on the other hand, "loads" existing environment variables into a struct. It supports the use of struct tags to specify alternate, default, and required environment variables.

_.env_

```bash
SERVICE_DEBUG=true
SERVICE_POSTGRES_DSN=postgresql://user@localhost
```

_config.go_

```go
package main

import (
  "log"
  "github.com/joho/godotenv"
  "github.com/kelseyhightower/envconfig"
)

type Config struct {
  Debug       bool    `default:"false"`
  PostgresDSN string  `envconfig:"POSTGRES_DSN"`
  Port        string  `default:":3000"`
}

func LoadConfig() *Config {
  _ = godotenv.Load()
  var cfg Config
  err := envconfig.Process("SERVICE", &cfg)
  if err != nil {
    log.Fatalf("could not load config: %v", err)
  }
  return &cfg
}
```

This code defines a `Config` struct that includes three configuration values, namely `Debug`, `PostgresDSN`, and `Port`. The `LoadConfig` function uses `godotenv` to load any values specified in a local `.env` file (if one exists), and `envconfig` to populate the `Config` struct with any environment variables that match the struct tags.

Once you've successfully loaded your configuration struct, you can initialize your config as follows:

_main.go_

```go
package main

import "fmt"

func main() {
  cfg := LoadConfig()
  fmt.Println(cfg.PostgresDSN)
}
```

In this example, `main.go` simply calls `LoadConfig` and prints out the value of the `PostgresDSN` configuration variable.

By leveraging environment variables and these two Go packages, you can create more portable, scalable, and secure applications that can be easily configured for different environments.
