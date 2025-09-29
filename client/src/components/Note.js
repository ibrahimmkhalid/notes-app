import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { endpointUrl } from "../helpers/urlHelpers";
import { observer } from "mobx-react";
import { useContext } from "react";
import UserStore from "../stores/userStore";

const Note = ({ data, props }) => {
  const userStore = useContext(UserStore);
  const deleteNote = (event) => {
    let requestOptions = {};
    requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };
    if (userStore.isLoggedIn) {
      requestOptions = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userStore.token}`,
        },
      };
    }
    let urlPart = `notes/${data.id}`;
    fetch(endpointUrl(urlPart), requestOptions)
      .then((response) => response.json())
      .then((data) => console.log(data));
    props.reloadNotesList();
  };

  return (
    <div className="note">
      <div>
        <div className="note-header">
          <span className="note-title">{data.title}</span>
          <span className="note-owner">
            {!data.owner ? "public" : data.owner}
          </span>
        </div>
        <span>{data.text}</span>
      </div>
      <div className="note-footer">
        <FontAwesomeIcon onClick={deleteNote} icon={faTrash} />
      </div>
    </div>
  );
};

export default observer(Note);
