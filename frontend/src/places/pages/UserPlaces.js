import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import PlaceList from "../components/PlaceList";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import ErrorModal from "../../shared/components/ErrorModal";

const UserPlaces = () => {
  const [loadedUserPlaces, setLoadedUserPlaces] = useState([]);
  const [isLoading, isError, sendRequest, clearError] = useHttpClient();
  const userId = useParams().userId;
  const fetchPlaces = useCallback(async () => {
    try {
      const response = await sendRequest(
        `${process.env.REACT_APP_API_URL}/places/user/${userId}`,
        "GET"
      );
      setLoadedUserPlaces(response.data.places);
    } catch (error) {
      setLoadedUserPlaces([]);
    }
  }, [sendRequest, userId]);

  useEffect(() => {
    fetchPlaces();
  }, [sendRequest, userId, fetchPlaces]);

  return (
    <>
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      <ErrorModal onClear={clearError} error={isError} />
      <PlaceList
        items={loadedUserPlaces}
        userId={userId}
        reFetchPlaces={fetchPlaces}
      />
    </>
  );
};

export default UserPlaces;
