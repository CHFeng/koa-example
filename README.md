## 專案結構
* src/app.js: entry point
* src/config.js: 專案環境變數設定檔
* src/routers: 路由列表
* src/models: database ORM
* src/middleware: 路由驗證token的middleware
* src/controllers: 參數檢查與回應
* src/service: 實際業務處理
* test: unit & integration test

## Docker usage
```
// build the docker image
docker build . -t meep-shop-exam
// run the docker container
docker-compose up
```
