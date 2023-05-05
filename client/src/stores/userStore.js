import { action, computed, makeObservable, observable } from "mobx";
import { createContext } from "react";

class UserStore {
  username = ""
  isAdmin = false
  token = ""

  constructor() {
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
  }

  logout() {
    this.username = ""
    this.isAdmin = false
    this.token = ""
  }

  get isLoggedIn() {
    return this.token !== ""
  }

}

export default createContext(new UserStore())
