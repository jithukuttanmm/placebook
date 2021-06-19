import React, { useContext } from "react";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import { AuthContext } from "../../shared/context/auth-context";
import PlaceItem from "./PlaceItem";
import "./PlaceList.css";

const PlaceList = (props) => {
  const auth = useContext(AuthContext);
  if (props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          {auth.user && auth.user.id === props.userId ? (
            <>
              <h2>No places found. Maybe create one?</h2>
              <Button to="/places/new">Share Place</Button>
            </>
          ) : (
            <h2>No places found for user.</h2>
          )}
        </Card>
      </div>
    );
  }

  return (
    <ul className="place-list">
      {props.items.map((place) => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={place.imageUrl}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creator}
          coordinates={place.location}
          reFetchPlaces={props.reFetchPlaces}
        />
      ))}
    </ul>
  );
};

export default PlaceList;
