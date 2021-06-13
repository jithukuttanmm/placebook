import React, { useEffect, useState } from "react";
import ErrorModal from "../../shared/components/ErrorModal";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import UsersList from "../components/UsersList";
import { useHttpClient } from "../../shared/components/http-hook";

const Users = () => {
  const [loadedUSers, setLoadedUSers] = useState([]);
  const [isLoading, error, sendRequest, clearError] = useHttpClient();

  useEffect(() => {
    async function fetchUsers() {
      const response = await sendRequest(
        "http://localhost:5000/api/users",
        "GET"
      );
      response && setLoadedUSers(response.data.users);
    }
    fetchUsers();
  }, []);

  return (
    <>
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      <ErrorModal onClear={clearError} error={error} />
      {!isLoading && !error && <UsersList items={loadedUSers} />}
    </>
  );
};

export default Users;
