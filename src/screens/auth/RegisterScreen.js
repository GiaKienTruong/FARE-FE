import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import ProgressBar from '../../components/common/ProgressBar';

const RegisterScreen = ({ navigation }) => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    // Step 2: OTP State
    const [otp, setOtp] = useState(['', '', '', '', '']);
    const otpRefs = useRef([]);

    // Step 3: Password State
    const [password, setPassword] = useState('');

    // Validation checks
    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const handleNextStep = () => {
        if (step < 3) {
            setLoading(true);
            // Simulate API call
            setTimeout(() => {
                setLoading(false);
                setStep(step + 1);
            }, 1000);
        } else if (step === 3) {
            setStep(4); // Success screen
        }
    };

    const handleOtpChange = (value, index) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 4) {
            otpRefs.current[index + 1].focus();
        }
    };

    const renderHeader = (title, currentStep) => (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#111827" />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
                <Text style={styles.headerTitle}>{title}</Text>
                <ProgressBar currentStep={currentStep} />
            </View>
            <View style={{ width: 24 }} />
        </View>
    );

    const renderStep1 = () => (
        <View style={styles.stepContainer}>
            {renderHeader(`Add your email 1 / 3`, 1)}
            <View style={styles.content}>
                <Input
                    label="Email"
                    placeholder="example@example"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <Button
                    title="Create an account"
                    onPress={handleNextStep}
                    loading={loading}
                    style={styles.actionButton}
                />
            </View>
            <View style={styles.footer}>
                <Text style={styles.footerText}>By using Fare, you agree to the</Text>
                <Text style={styles.footerLink}>Terms and Privacy Policy.</Text>
            </View>
        </View>
    );

    const renderStep2 = () => (
        <View style={styles.stepContainer}>
            {renderHeader(`Verify your email 2 / 3`, 2)}
            <View style={styles.content}>
                <Text style={styles.description}>
                    We just sent 5-digit code to {email || 'your email'}, enter it below:
                </Text>

                <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => (otpRefs.current[index] = ref)}
                            style={styles.otpInput}
                            value={digit}
                            onChangeText={(text) => handleOtpChange(text, index)}
                            keyboardType="number-pad"
                            maxLength={1}
                            onKeyPress={({ nativeEvent }) => {
                                if (nativeEvent.key === 'Backspace' && !digit && index > 0) {
                                    otpRefs.current[index - 1].focus();
                                }
                            }}
                        />
                    ))}
                </View>

                <Button
                    title="Verify email"
                    onPress={handleNextStep}
                    loading={loading}
                    style={styles.actionButton}
                />

                <TouchableOpacity style={styles.linkButton}>
                    <Text style={styles.linkButtonText}>
                        Wrong email? <Text style={styles.boldLink}>Send to different email</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderStep3 = () => (
        <View style={styles.stepContainer}>
            {renderHeader(`Create your password 3 / 3`, 3)}
            <View style={styles.content}>
                <Input
                    label="Password"
                    placeholder="Enter password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <View style={styles.validationContainer}>
                    <ValidationItem label="8 characters minimum" isValid={hasMinLength} />
                    <ValidationItem label="a number" isValid={hasNumber} />
                    <ValidationItem label="a symbol" isValid={hasSymbol} />
                </View>

                <Button
                    title="Continue"
                    onPress={handleNextStep}
                    loading={loading}
                    disabled={!(hasMinLength && hasNumber && hasSymbol)}
                    style={styles.actionButton}
                />
            </View>
            <View style={styles.footer}>
                <Text style={styles.footerText}>By using Fare, you agree to the</Text>
                <Text style={styles.footerLink}>Terms and Privacy Policy.</Text>
            </View>
        </View>
    );

    const renderSuccess = () => (
        <View style={styles.successContainer}>
            <View style={styles.successIconContainer}>
                <View style={styles.successIconBg}>
                    <Ionicons name="checkmark-circle" size={80} color="#71D5F3" />
                </View>
            </View>

            <Text style={styles.successTitle}>Your account was successfully created!</Text>
            <Text style={styles.successSub}>Only one click to explore online education.</Text>

            <Button
                title="Log in"
                onPress={() => navigation.navigate('Login')}
                style={styles.actionButton}
            />

            <View style={styles.footer}>
                <Text style={styles.footerText}>By using Fare, you agree to the</Text>
                <Text style={styles.footerLink}>Terms and Privacy Policy.</Text>
            </View>
        </View>
    );

    const ValidationItem = ({ label, isValid }) => (
        <View style={styles.validationItem}>
            <Ionicons
                name={isValid ? "checkmark-circle" : "ellipse-outline"}
                size={18}
                color={isValid ? "#10B981" : "#9CA3AF"}
            />
            <Text style={[styles.validationText, isValid && styles.validationTextActive]}>
                {label}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && renderSuccess()}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    stepContainer: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        marginBottom: 20,
    },
    headerTitleContainer: {
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    description: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 20,
        marginBottom: 30,
        textAlign: 'center',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
    },
    otpInput: {
        width: 56,
        height: 56,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        borderRadius: 16,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '700',
        backgroundColor: '#FFFFFF',
    },
    actionButton: {
        marginTop: 20,
    },
    linkButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    linkButtonText: {
        fontSize: 14,
        color: '#4B5563',
    },
    boldLink: {
        fontWeight: '700',
        color: '#111827',
    },
    validationContainer: {
        marginTop: 10,
        marginBottom: 20,
        gap: 12,
    },
    validationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    validationText: {
        fontSize: 14,
        color: '#9CA3AF',
    },
    validationTextActive: {
        color: '#111827',
    },
    footer: {
        paddingBottom: 20,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    footerLink: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    successContainer: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    successIconContainer: {
        marginBottom: 32,
    },
    successIconBg: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F0FDFA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    successTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#111827',
        textAlign: 'center',
        marginBottom: 12,
    },
    successSub: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 40,
    },
});

export default RegisterScreen;
