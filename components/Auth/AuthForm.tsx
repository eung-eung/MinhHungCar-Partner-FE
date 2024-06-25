import React, { useState } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Input from './Input';

export default function AuthForm({ isLogin, onSubmit, credentialsInvalid }: { isLogin: any, onSubmit: any, credentialsInvalid: any }) {
    const [enteredEmail, setEnteredEmail] = useState('');
    const [enteredPassword, setEnteredPassword] = useState('');
    const [enteredConfirmPassword, setEnteredConfirmPassword] = useState('');
    const [enteredFirstName, setEnteredFirstName] = useState('');
    const [enteredLastName, setEnteredLastName] = useState('');
    const [enteredPhoneNum, setEnteredPhoneNum] = useState('');

    const {
        email: emailIsInvalid,
        password: passwordIsInvalid,
        confirmPassword: passwordsDontMatch,
        first_name: firstNameIsInvalid,
        last_name: lastNameIsInvalid,
        phone_number: phoneIsInvalid
    } = credentialsInvalid;

    function updateInputValueHandler(inputType, enteredValue) {
        switch (inputType) {
            case 'email':
                setEnteredEmail(enteredValue);
                break;
            case 'password':
                setEnteredPassword(enteredValue);
                break;
            case 'confirmPassword':
                setEnteredConfirmPassword(enteredValue);
                break;
            case 'first_name':
                setEnteredFirstName(enteredValue)
                break;
            case 'last_name':
                setEnteredLastName(enteredValue)
                break;
            case 'phone_number':
                setEnteredPhoneNum(enteredValue)
                break;
        }
    }

    function submitHandler() {
        onSubmit({
            email: enteredEmail,
            password: enteredPassword,
            confirmPassword: enteredConfirmPassword,
            last_name: enteredLastName,
            first_name: enteredFirstName,
            phone_number: enteredPhoneNum
        });
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView>
                <View >
                    <KeyboardAwareScrollView>

                        <View style={styles.form}>
                            {!isLogin && (
                                <View style={styles.input}>
                                    <Text style={styles.inputLabel}>Họ
                                        <Text style={{ color: 'red' }}>*</Text>
                                    </Text>
                                    <Input
                                        onUpdateValue={updateInputValueHandler.bind(
                                            this,
                                            'first_name'
                                        )}
                                        value={enteredFirstName}
                                        isInvalid={firstNameIsInvalid}
                                        placeholder='Nguyễn'
                                    />
                                </View>
                            )}

                            {!isLogin && (
                                <View style={styles.input}>
                                    <Text style={styles.inputLabel}>Tên  <Text style={{ color: 'red' }}>*</Text>
                                    </Text>

                                    <Input
                                        onUpdateValue={updateInputValueHandler.bind(
                                            this,
                                            'last_name'
                                        )}
                                        placeholder='Văn A'
                                        value={enteredLastName}
                                        isInvalid={lastNameIsInvalid}
                                    />
                                </View>
                            )}

                            {!isLogin && (
                                <View style={styles.input}>
                                    <Text style={styles.inputLabel}>Số điện thoại  <Text style={{ color: 'red' }}>*</Text></Text>

                                    {/* <TextInput
                  clearButtonMode="while-editing"
                  onChangeText={phone => setForm({ ...form, phone })}
                  placeholder="0987654321"
                  placeholderTextColor="#6b7280"
                  style={styles.inputControl}
                  value={form.phone} /> */}

                                    <Input
                                        // label="Số điện thoại"
                                        onUpdateValue={updateInputValueHandler.bind(this, 'phone_number')}
                                        value={enteredPhoneNum}
                                        // keyboardType="email-address"
                                        isInvalid={phoneIsInvalid}
                                        placeholder="0987654321"
                                    />

                                </View>
                            )}
                            <View style={styles.input}>
                                <Text style={styles.inputLabel}>Địa chỉ email<Text style={{ color: 'red' }}>*</Text></Text>
                                <Input
                                    onUpdateValue={updateInputValueHandler.bind(this, 'email')}
                                    value={enteredEmail}
                                    keyboardType="email-address"
                                    isInvalid={emailIsInvalid}
                                    placeholder="Email"
                                />
                            </View>


                            <View style={styles.input}>
                                <Text style={styles.inputLabel}>Mật khẩu  <Text style={{ color: 'red' }}>*</Text></Text>

                                <Input
                                    onUpdateValue={updateInputValueHandler.bind(this, 'password')}
                                    secure
                                    value={enteredPassword}
                                    isInvalid={passwordIsInvalid}
                                    placeholder="*********"
                                />
                            </View>

                            {!isLogin && (
                                <View style={styles.input}>
                                    <Text style={styles.inputLabel}>Xác nhận mật khẩu  <Text style={{ color: 'red' }}>*</Text></Text>

                                    <Input
                                        // label="Confirm Password"
                                        onUpdateValue={updateInputValueHandler.bind(
                                            this,
                                            'confirmPassword'
                                        )}
                                        secure
                                        value={enteredConfirmPassword}
                                        isInvalid={passwordsDontMatch}
                                        placeholder="*********"
                                    />
                                </View>
                            )}



                            <View style={styles.formAction}>
                                <TouchableOpacity
                                    onPress={submitHandler}>
                                    <View style={styles.btn}>
                                        {isLogin ?
                                            <Text style={styles.btnText}>Đăng nhập</Text>
                                            :
                                            <Text style={styles.btnText}>Đăng kí</Text>}
                                    </View>
                                </TouchableOpacity>
                            </View>
                            {isLogin && (
                                <>
                                    <Text style={styles.formActionSpacer}>hoặc tiếp tục với</Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            // handle onPress
                                        }}
                                    >
                                        <View style={styles.btnSecondary}>
                                            <Text style={styles.btnSecondaryText}>Google</Text>
                                            <View style={{ width: 15 }} />
                                        </View>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </KeyboardAwareScrollView>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 24,
        paddingHorizontal: 0,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1d1d1d',
        marginBottom: 6,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        fontWeight: '500',
        color: '#929292',
        textAlign: 'center'
    },
    /** Header */
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 45,
        marginTop: 18,
        marginBottom: 36
    },
    /** Form */
    form: {
        marginBottom: 24,
        paddingHorizontal: 0,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
    formAction: {
        marginVertical: 5,
    },

    /** Input */
    input: {
        marginBottom: 30,
    },
    inputLabel: {
        fontSize: 17,
        fontWeight: '600',
        color: '#222',
        marginBottom: 0,
    },
    inputControl: {
        height: 44,
        backgroundColor: '#F7F7F7',
        paddingHorizontal: 16,
        borderRadius: 12,
        fontSize: 15,
        fontWeight: '500',
        color: '#222',
        borderStyle: 'solid',
    },
    /** Button */
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderWidth: 1,
        backgroundColor: '#5548E2',
        borderColor: '#5548E2',
    },
    btnText: {
        fontSize: 17,
        lineHeight: 24,
        fontWeight: '600',
        color: '#fff',
    },
    formActionSpacer: {
        marginVertical: 22,
        fontSize: 14,
        fontWeight: '600',
        color: '#4b4858',
        textAlign: 'center',
    },
    btnSecondary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderWidth: 1,
        backgroundColor: 'transparent',
        borderColor: '#000',
        marginBottom: 45,
    },
    btnSecondaryText: {
        fontSize: 17,
        lineHeight: 24,
        fontWeight: '600',
        color: '#000',
        justifyContent: 'center',
    },
});