import React, { useContext, useState } from "react";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import "./PlaceItem.css";
import Map from "../../shared/components/UIElements/Map";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import ErrorModal from "../../shared/components/ErrorModal";

const PlaceItem = (props) => {
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoading, isError, sendRequest, clearError] = useHttpClient();

  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);

  const openDeleteHandler = () => setShowDeleteConfirm(true);
  const closeDeleteHandler = () => setShowDeleteConfirm(false);
  const confirmDeleteHandler = async () => {
    closeDeleteHandler();
    try {
      await sendRequest(
        `${process.env.REACT_APP_API_URL}/places/${props.id}`,
        "DELETE",
        null,
        { Authorization: `Bearer ${auth.token}` }
      );
      await props.reFetchPlaces();
    } catch (error) {}
  };
  return (
    <React.Fragment>
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      <ErrorModal onClear={clearError} error={isError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map zoom={15} center={props.coordinates} />
        </div>
      </Modal>
      <Modal
        show={showDeleteConfirm}
        onCancel={closeDeleteHandler}
        header={"Do you really want to delete ??"}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={
          <>
            <Button onClick={closeDeleteHandler}>Cancel</Button>
            <Button onClick={confirmDeleteHandler} danger>
              Delete
            </Button>
          </>
        }
      >
        <div className="place-item__info">
          <h2>
            <p>It can not be undone !</p>
          </h2>
        </div>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          <div className="place-item__image">
            <img
              src={"http://localhost:5000/" + props.image}
              alt={props.title}
            />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {auth.isLoggedIn && props.creatorId === auth.user.id && (
              <Button to={`/places/${props.id}`}>EDIT</Button>
            )}
            {auth.isLoggedIn && props.creatorId === auth.user.id && (
              <Button danger onClick={openDeleteHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
