import { action, computed, observable } from "mobx";
import { createContext } from "react";

class UserStore {
  @observable username = ""
  @observable isAdmin = false
  @observable token = ""

  @action loadUser = (data) => {
    this.username = data.username
    this.isAdmin = data.admin
    this.token = data.token
  }

  @action logout = () => {
    this.username = ""
    this.isAdmin = false
    this.token = ""
  }

  @computed isLoggedIn = () => {
    return this.token !== ""
  }

}

export default createContext(new UserStore())
