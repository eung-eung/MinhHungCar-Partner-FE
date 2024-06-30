
// import React, { useContext, useState } from 'react';
// import {
//     StyleSheet,
//     SafeAreaView,
//     View,
//     Text,
//     TouchableOpacity,
//     TextInput,
//     Alert,
//     ScrollView,
// } from 'react-native';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { AntDesign } from '@expo/vector-icons';
// import { AuthConText } from '@/store/AuthContext';
// import { getUser } from '@/util/auth';
// import LoadingOverlay from '@/components/LoadingOverlay';
// import { LinearGradient } from 'expo-linear-gradient';
// import AuthContent from '@/components/Auth/AuthContent';
// import { router } from 'expo-router';

// export default function SignInScreen() {
//     const [isAuthenticating, setIsAuthenticating] = useState(false)
//     const authCtx = useContext(AuthConText)

//     const signInHandler = async ({ email, password }: { email: any, password: any }) => {
//         setIsAuthenticating(true)
//         try {
//             const { token } = await getUser(email, password)
//             console.log('token: ', token);
//             // console.log('id: ', userID);
//             authCtx.authenticate(token)
//         } catch (error) {

//             setIsAuthenticating(false)
//         }
//     }

//     return (
//         // <SafeAreaView style={{ flex: 1 }}>

//         <ScrollView contentContainerStyle={styles.scrollContainer}>
//             {isAuthenticating && <LoadingOverlay message='' />}
//             <LinearGradient
//                 colors={['#5457FB', '#FFFFFF']}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 0, y: 1 }}
//                 locations={[0.09, 0.84]}
//                 style={styles.gradient}
//             >
//                 <View style={styles.header}>
//                     <Text style={styles.title}>Đăng nhập</Text>
//                 </View>
//             </LinearGradient>
//             <View style={styles.container}>

//                 <View style={styles.form}>
//                     <AuthContent isLogin onAuthenticate={signInHandler} />
//                 </View>
//             </View>
//         </ScrollView>

//         // </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     scrollContainer: {
//         flexGrow: 1,
//         justifyContent: 'center',
//     },
//     container: {
//         paddingHorizontal: 5,
//         paddingVertical: 100,
//         backgroundColor: 'white'
//     },
//     gradient: {
//         flex: 1,
//     },
//     header: {
//         paddingTop: 110
//     },
//     title: {
//         fontSize: 32,
//         fontWeight: 'bold',
//         color: 'white',
//         marginBottom: 6,
//         textAlign: 'center',
//     },
//     subtitle: {
//         fontSize: 15,
//         fontWeight: '500',
//         color: '#929292',
//         textAlign: 'center',
//     },
//     form: {
//         marginTop: -120,
//     },
//     formAction: {
//         marginVertical: 24,
//     },
//     formFooter: {
//         fontSize: 15,
//         fontWeight: '500',
//         color: '#222',
//         textAlign: 'center',
//     },
//     input: {
//         marginBottom: 16,
//     },
//     inputLabel: {
//         fontSize: 17,
//         fontWeight: '600',
//         color: 'black',
//         marginBottom: 8,
//     },
//     inputControl: {
//         height: 44,
//         backgroundColor: '#F7F7F7',
//         paddingHorizontal: 16,
//         borderRadius: 12,
//         fontSize: 15,
//         fontWeight: '500',
//         color: '#222',
//     },
//     btn: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         borderRadius: 8,
//         paddingVertical: 8,
//         paddingHorizontal: 16,
//         borderWidth: 1,
//         backgroundColor: '#5548E2',
//         borderColor: '#5548E2',
//     },
//     btnText: {
//         fontSize: 17,
//         lineHeight: 24,
//         fontWeight: '600',
//         color: '#fff',
//     },
//     formActionSpacer: {
//         marginVertical: 22,
//         fontSize: 14,
//         fontWeight: '600',
//         color: '#4b4858',
//         textAlign: 'center',
//     },
//     btnSecondary: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         borderRadius: 8,
//         paddingVertical: 8,
//         paddingHorizontal: 20,
//         borderWidth: 1,
//         backgroundColor: 'transparent',
//         borderColor: '#000',
//         marginBottom: 45,
//     },
//     btnSecondaryText: {
//         fontSize: 17,
//         lineHeight: 24,
//         fontWeight: '600',
//         color: '#000',
//         justifyContent: 'center',
//     },
// });
