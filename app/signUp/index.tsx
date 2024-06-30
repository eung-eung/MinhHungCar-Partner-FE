// import React, { useState } from 'react';
// import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';

// interface AuthFormProps {
//     isLogin: boolean;
//     onSubmit: (credentials: {
//         email: string;
//         password: string;
//         confirmPassword?: string;
//         last_name?: string;
//         first_name?: string;
//         phone_number?: string;
//     }) => void;
//     credentialsInvalid: {
//         email: boolean;
//         password: boolean;
//         confirmPassword: boolean;
//         last_name: boolean;
//         first_name: boolean;
//         phone_number: boolean;
//     };
// }

// const AuthForm: React.FC<AuthFormProps> = ({ isLogin, onSubmit, credentialsInvalid }) => {
//     const [credentials, setCredentials] = useState({
//         email: '',
//         password: '',
//         confirmPassword: '',
//         last_name: '',
//         first_name: '',
//         phone_number: ''
//     });

//     const handleChange = (key: keyof typeof credentials, value: string) => {
//         setCredentials({ ...credentials, [key]: value });
//     };

//     return (
//         <View style={styles.form}>
//             <TextInput
//                 style={[styles.input, credentialsInvalid.email && styles.invalidInput]}
//                 placeholder="Email"
//                 onChangeText={(text) => handleChange('email', text)}
//                 value={credentials.email}
//             />
//             <TextInput
//                 style={[styles.input, credentialsInvalid.password && styles.invalidInput]}
//                 placeholder="Password"
//                 onChangeText={(text) => handleChange('password', text)}
//                 value={credentials.password}
//                 secureTextEntry
//             />
//             {!isLogin && (
//                 <>
//                     <TextInput
//                         style={[styles.input, credentialsInvalid.confirmPassword && styles.invalidInput]}
//                         placeholder="Confirm Password"
//                         onChangeText={(text) => handleChange('confirmPassword', text)} // Make sure to handle confirmPassword
//                         value={credentials.confirmPassword}
//                         secureTextEntry
//                     />
//                     <TextInput
//                         style={[styles.input, credentialsInvalid.first_name && styles.invalidInput]}
//                         placeholder="First Name"
//                         onChangeText={(text) => handleChange('first_name', text)}
//                         value={credentials.first_name}
//                     />
//                     <TextInput
//                         style={[styles.input, credentialsInvalid.last_name && styles.invalidInput]}
//                         placeholder="Last Name"
//                         onChangeText={(text) => handleChange('last_name', text)}
//                         value={credentials.last_name}
//                     />
//                     <TextInput
//                         style={[styles.input, credentialsInvalid.phone_number && styles.invalidInput]}
//                         placeholder="Phone Number"
//                         onChangeText={(text) => handleChange('phone_number', text)}
//                         value={credentials.phone_number}
//                     />
//                 </>
//             )}
//             <TouchableOpacity style={styles.button} onPress={() => onSubmit(credentials)}>
//                 <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
//             </TouchableOpacity>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     form: {
//         marginBottom: 10,
//     },
//     input: {
//         borderWidth: 1,
//         borderColor: '#ccc',
//         borderRadius: 5,
//         paddingHorizontal: 10,
//         paddingVertical: 8,
//         marginBottom: 10,
//     },
//     invalidInput: {
//         borderColor: 'red',
//     },
//     button: {
//         backgroundColor: '#007BFF',
//         paddingVertical: 12,
//         borderRadius: 5,
//         alignItems: 'center',
//     },
//     buttonText: {
//         color: '#fff',
//         fontSize: 18,
//         fontWeight: 'bold',
//     },
// });

// export default AuthForm;
