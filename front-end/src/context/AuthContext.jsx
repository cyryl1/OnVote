import { createContext, useState } from "react";
import PropTypes from "prop-types";

export const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
    const [tokens, setTokens] = useState({
        accessToken: null,
        resetToken: null,
    });

    const saveTokens = (newTokens) => {
        localStorage.setItem("accessToken", newTokens.accessToken);
        localStorage.setItem("resetToken", newTokens.resetToken);

        setTokens(newTokens);
    }

    const [name, setName] = useState(null);

    const [electionDetails, setElectionDetails] = useState({
        title: '',
        start_date: '',
        end_date: '',
    });

    const saveElectionDetails = (newDetails) => {
        localStorage.setItem("election_title", newDetails.title);
        localStorage.setItem("election_start_date", newDetails.start_date);
        localStorage.setItem("election_end_date", newDetails.end_date);

        setElectionDetails(newDetails);
    }
    


    return (
        <TokenContext.Provider 
            value={{ 
                tokens, 
                saveTokens,
                setTokens, 
                name, 
                setName, 
                electionDetails,
                saveElectionDetails,
                setElectionDetails,
            }}
        >
            {children}
        </TokenContext.Provider>
    );
};

TokenProvider.propTypes = {
    children: PropTypes.node.isRequired,
}
