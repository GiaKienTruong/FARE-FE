import { LinearGradient } from 'expo-linear-gradient';
import {
    Dimensions,
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Button from '../../components/common/Button';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <LinearGradient
                colors={['#A5E3FB', '#71D5F3']}
                style={styles.gradient}
            >
                <SafeAreaView style={styles.content}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../../../src/assets/logo/logo-white.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>

                    <View style={styles.bottomSection}>
                        <Text style={styles.welcomeText}>Welcome to FARE</Text>
                        <Text style={styles.descriptionText}>
                            Let us help you organize your wardrobe and discover new outfit ideas
                        </Text>

                        <Button
                            title="Create an account"
                            onPress={() => navigation.navigate('Register')}
                            style={styles.createButton}
                            textStyle={styles.createButtonText}
                        />

                        <View style={styles.loginContainer}>
                            <Text style={styles.loginText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('LoginOptions')}>
                                <Text style={styles.loginLink}>Log in</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 30,
        justifyContent: 'space-between',
        paddingBottom: 40,
    },
    logoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: width * 0.5,
        height: width * 0.5,
    },
    bottomSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 12,
    },
    descriptionText: {
        fontSize: 14,
        color: '#FFFFFF',
        textAlign: 'center',
        opacity: 0.9,
        marginBottom: 40,
        lineHeight: 20,
        paddingHorizontal: 10,
    },
    createButton: {
        backgroundColor: '#FFFFFF',
        borderWidth: 0,
        height: 56,
        borderRadius: 12,
        width: '100%',
    },
    createButtonText: {
        color: '#111827',
        fontSize: 16,
        fontWeight: '700',
    },
    loginContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    loginText: {
        color: '#FFFFFF',
        fontSize: 14,
    },
    loginLink: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
        textDecorationLine: 'underline',
    },
});

export default WelcomeScreen;
