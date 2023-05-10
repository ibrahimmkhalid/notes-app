import { action, computed, makeObservable, observable } from "mobx";
import { createContext } from "react";

class UserStore {
  username = ""
  isAdmin = false
  token = ""

  constructor() {
    let userdata = localStorage.getItem("user_login_info")
    if (userdata) {
      userdata = JSON.parse(userdata)
      this.username = userdata.username
      this.isAdmin = userdata.admin
      this.token = userdata.token
    }
    makeObservable(this, {
      username: observable,
      isAdmin: observable,
      token: observable,
      loadUser: action,
      logout: action,
      isLoggedIn: computed
    })
  }
  loadUser(data) {
    this.username = data.username
    this.isAdmin = data.admin
    this.token = data.token
    let userdata = {
      username: this.username,
      isAdmin: this.isAdmin,
      token: this.token
    }
    localStorage.setItem("user_login_info", JSON.stringify(userdata))
  }

  logout() {
    this.token = ""
    this.username = ""
    this.isAdmin = false
    localStorage.removeItem("user_login_info")
  }

  get isLoggedIn() {
    return this.token !== ""
  }

}

export default createContext(new UserStore())
