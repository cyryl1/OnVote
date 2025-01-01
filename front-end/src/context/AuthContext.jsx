import { createContext, useState } from "react";
import PropTypes from "prop-types";

export const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
    const [tokens, setTokens] = useState({
        accessToken: null,
        resetToken: null,
    });

    const [name, setName] = useState(null);

    const [electionDetails, setElectionDetails] = useState({
        title: '',
        start_date: '',
        end_date: '',
    });


    return (
        <TokenContext.Provider 
            value={{ 
                tokens, 
                setTokens, 
                name, 
                setName, 
                electionDetails, 
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
