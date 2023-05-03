import { makeAutoObservable } from "mobx";
import { createContext } from "react";

class UserStore {
  username = ""
  isAdmin = false
  token = ""

  constructor() {
    makeAutoObservable(this)
  }
  loadUser = (data) => {
    this.username = data.username
    this.isAdmin = data.admin
    this.token = data.token
  }

  logout = () => {
    this.username = ""
    this.isAdmin = false
    this.token = ""
  }

  isLoggedIn = () => {
    return this.token !== ""
  }

}

export default createContext(new UserStore())
