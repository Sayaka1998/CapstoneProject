import http from "../httpcommon"

class httpSrv {
    login(data) {
        return http.post("/login", data)
    }
    logout(data) {
        return http.post("/logout", data)
    }
    register(data) {
        return http.post("/register", data)
    }
    change(data) {
        return http.post("/change", data)
    }
    delete(data) {
        return http.post("/delete", data)
    }
    ticket(data) {
        return http.post("/ticket", data)
    }
    buy(data) {
        return http.post("/buy", data)
    }
    history(data) {
        return http.post("/history", data)
    }
}

export default new httpSrv()