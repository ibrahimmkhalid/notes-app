function TopBar() {
  return (
    <nav className="navbar navbar-expand-lg bg-light top-bar">
      <div className="container-fluid">
        <span className="navbar-brand mb-0 h1">Notes App by @ibrahimmkhalid</span>
        <form className="d-flex">
          <input className="form-control me-2" type="text" placeholder="username" aria-label="username"></input>
          <input className="form-control me-2" type="password" placeholder="password" aria-label="password"></input>
          <button className="btn btn-outline-success" type="submit">Login/Register</button>
        </form>
      </div>
    </nav>
  )
}

export default TopBar 
