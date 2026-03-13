import { Ionicons } from '@expo/vector-icons';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Button from '../../components/common/Button';
import firebase, { auth } from '../../config/firebase';

WebBrowser.maybeCompleteAuthSession();

const LoginOptionsScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false);

    // Google Auth
    const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
        androidClientId: 'YOUR_ANDROID_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
        iosClientId: 'YOUR_IOS_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
        webClientId: 'YOUR_WEB_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
    });

    // Facebook Auth
    const [fbRequest, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
        clientId: 'YOUR_FACEBOOK_APP_ID',
    });

    useEffect(() => {
        if (googleResponse?.type === 'success') {
            const { id_token } = googleResponse.params;
            const credential = firebase.auth.GoogleAuthProvider.credential(id_token);
            handleSocialLogin(credential);
        }
    }, [googleResponse]);

    useEffect(() => {
        if (fbResponse?.type === 'success') {
            const { access_token } = fbResponse.params;
            const credential = firebase.auth.FacebookAuthProvider.credential(access_token);
            handleSocialLogin(credential);
        }
    }, [fbResponse]);

    const handleSocialLogin = async (credential) => {
        setLoading(true);
        try {
            await auth.signInWithCredential(credential);
            // AuthContext will handle the rest (syncing)
        } catch (error) {
            console.error('Social login error:', error);
            Alert.alert('Lỗi', 'Đăng nhập không thành công. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const SocialButton = ({ icon, title, onPress, provider, disabled }) => {
        const getIconColor = () => {
            if (provider === 'apple') return '#000000';
            if (provider === 'facebook') return '#1877F2';
            if (provider === 'google') return '#EA4335';
            return '#000000';
        };

        return (
            <TouchableOpacity 
                style={[styles.socialButton, disabled && { opacity: 0.5 }]} 
                onPress={onPress}
                disabled={disabled}
            >
                <Ionicons name={icon} size={24} color={getIconColor()} style={styles.socialIcon} />
                <Text style={styles.socialButtonText}>{title}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#111827" />
            </TouchableOpacity>

            <View style={styles.content}>
                {loading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#71D5F3" />
                    </View>
                )}
                
                <Text style={styles.title}>Log into account</Text>

                <Text style={styles.subtitle}>
                    Welcome back!{'\n'}Let's coordinate your style
                </Text>

                <Button
                    title="Continue with email"
                    onPress={() => navigation.navigate('Login')}
                    style={styles.emailButton}
                    textStyle={styles.emailButtonText}
                />

                <View style={styles.dividerContainer}>
                    <View style={styles.line} />
                    <Text style={styles.dividerText}>or</Text>
                    <View style={styles.line} />
                </View>

                <View style={styles.socialContainer}>
                    <SocialButton
                        icon="logo-google"
                        title="Continue with Google"
                        onPress={() => googlePromptAsync()}
                        provider="google"
                        disabled={loading || !googleRequest}
                    />
                    <SocialButton
                        icon="logo-facebook"
                        title="Continue with Facebook"
                        onPress={() => fbPromptAsync()}
                        provider="facebook"
                        disabled={loading || !fbRequest}
                    />
                    <SocialButton
                        icon="logo-apple"
                        title="Continue with Apple"
                        onPress={() => Alert.alert('Thông báo', 'Tính năng đang phát triển')}
                        provider="apple"
                        disabled={loading}
                    />
                </View>

                <Text style={styles.footerText}>
                    By using Fare, you agree to the{'\n'}
                    <Text style={styles.linkText}>Terms</Text> and <Text style={styles.linkText}>Privacy Policy</Text>.
                </Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    backButton: {
        padding: 20,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.7)',
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#111827',
        marginTop: 10,
        marginBottom: 24,
    },
    subtitle: {
        fontSize: 16,
        color: '#4B5563',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 40,
    },
    emailButton: {
        backgroundColor: '#71D5F3',
        borderRadius: 12,
        height: 56,
        width: '100%',
        marginBottom: 24,
    },
    emailButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 24,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    dividerText: {
        marginHorizontal: 16,
        color: '#9CA3AF',
        fontSize: 14,
    },
    socialContainer: {
        width: '100%',
        gap: 12,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
    },
    socialIcon: {
        marginRight: 10,
    },
    socialButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    footerText: {
        position: 'absolute',
        bottom: 40,
        textAlign: 'center',
        color: '#6B7280',
        fontSize: 12,
        lineHeight: 18,
    },
    linkText: {
        color: '#111827',
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});

export default LoginOptionsScreen;
