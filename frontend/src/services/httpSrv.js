import http from "../httpcommon"

class httpSrv {
    login(data) {
        return http.post("/login", data)
    }
    logout(data) {
        return http.post("/logout", data)
    }
    registerAccount(data) {
        return http.post("/registerAccount", data)
    }
    registerStaff(data) {
        return http.post("/registerStaff", data)
    }
    change(data) {
        return http.post("/change", data)
    }
    deleteAccount(data) {
        return http.post("/deleteAccount", data)
    }
    ulist(data) {
        return http.post("/ulist", data)
    }
    deleteUser(data) {
        return http.post("/deleteUser", data)
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
    addTickets(data) {
        return http.post("/addTickets", data)
    }
    deleteTickets(data) {
        return http.post("/deleteTickets", data)
    }
}

export default new httpSrv()