import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import PlaceList from "../components/PlaceList";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import ErrorModal from "../../shared/components/ErrorModal";

const UserPlaces = () => {
  const [loadedUserPlaces, setLoadedUserPlaces] = useState([]);
  const [isLoading, isError, sendRequest, clearError] = useHttpClient();
  const userId = useParams().userId;

  useEffect(() => {
    async function fetchPlaces() {
      try {
        const response = await sendRequest(
          `http://localhost:5000/api/places/user/${userId}`,
          "GET"
        );
        setLoadedUserPlaces(response.data.places);
      } catch (error) {
        setLoadedUserPlaces([]);
      }
    }
    fetchPlaces();
  }, [sendRequest, userId]);

  return (
    <>
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      <ErrorModal onClear={clearError} error={isError} />
      <PlaceList items={loadedUserPlaces} userId={userId} />
    </>
  );
};

export default UserPlaces;
