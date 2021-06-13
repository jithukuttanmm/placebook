import { useCallback, useState } from "react";
import axios from "axios";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setError] = useState(null);
  function clearError() {
    setError(null);
  }

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      try {
        const response = await axios({
          method,
          url,
          data: body,
        });

        return response;
      } catch (error) {
        setError((error.response && error.response.data.error) || error + "");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return [isLoading, isError, sendRequest, clearError];
};
