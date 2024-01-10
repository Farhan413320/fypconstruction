// // AuthContext.js
// import { createContext, useContext } from 'react';
// import { useNavigation } from '@react-navigation/native';


// const AuthContext = createContext();

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// export const AuthProvider = ({ children }) => {
//     // const navigation = useNavigation();
//   const logout = () => {
//     navigation.navigate('Login');
//   };

//   return (
//     <AuthContext.Provider value={{ logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
