import { useLocalSearchParams } from 'expo-router'
import { SafeAreaView, Text, View } from 'react-native'

export default function car() {
    const { slug } = useLocalSearchParams()
    return (
        <SafeAreaView>
            <View>
                <Text>{slug}</Text>
                <Text>Xe</Text>
                <Text>Xe</Text>
                <Text>Xe</Text>
            </View>
        </SafeAreaView>
    )
}
