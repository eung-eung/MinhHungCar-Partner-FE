import { View, Text, TextInput, StyleSheet } from 'react-native';

import { Colors } from '@/constants/Colors';

function Input({
    label,
    keyboardType,
    secure,
    onUpdateValue,
    value,
    isInvalid,
    placeholder
}) {
    return (
        <View style={styles.inputContainer}>
            <Text style={[styles.label, isInvalid && styles.labelInvalid]}>
                {label}
            </Text>
            <TextInput
                placeholder={placeholder}
                style={[styles.input, isInvalid && styles.inputInvalid]}
                autoCapitalize='none'
                // autoCapitalize="none"
                keyboardType={keyboardType}
                secureTextEntry={secure}
                onChangeText={onUpdateValue}
                value={value}
            />
        </View>
    );
}

export default Input;

const styles = StyleSheet.create({
    inputContainer: {
        // marginVertical: 8,

    },

    labelInvalid: {
        color: Colors.colors.error500,
    },
    input: {
        height: 44,
        backgroundColor: '#F7F7F7',
        paddingHorizontal: 16,
        borderRadius: 12,
        fontSize: 15,
        fontWeight: '500',
        color: '#222',
    },
    inputInvalid: {
        backgroundColor: Colors.colors.error100,
    },
});