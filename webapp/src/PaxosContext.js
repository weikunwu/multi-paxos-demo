import {
  createContext,
  useState,
} from 'react';

const PaxosContext = createContext();

const PaxosProvider = ({ children }) => {
  const [paxosState, setPaxosState] = useState({
    on: false, // Determine whether simulation is on or paused
    speed: 2, // Speed must be between 1 - 5, which determine the speed of simulation
    dropRate: 0.1, // Possibility that a message is dropped
    tab: 'playground',
    scenario: 'fault1',
    servers: [], // A list of server objects
    packets: [], // A list of packets objects
  })

  return (
    <PaxosContext.Provider value={[paxosState, setPaxosState]}>
      {children}
    </PaxosContext.Provider>
  );
};

export { PaxosContext, PaxosProvider };
