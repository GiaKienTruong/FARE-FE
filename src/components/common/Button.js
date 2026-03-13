import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

const Button = ({
    onPress,
    title,
    type = 'primary',
    loading = false,
    disabled = false,
    style,
    textStyle
}) => {
    const isPrimary = type === 'primary';
    const isOutline = type === 'outline';

    const buttonStyles = [
        styles.button,
        isPrimary && styles.primaryButton,
        isOutline && styles.outlineButton,
        (disabled || loading) && styles.disabledButton,
        style
    ];

    const titleStyles = [
        styles.title,
        isPrimary && styles.primaryTitle,
        isOutline && styles.outlineTitle,
        textStyle
    ];

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            disabled={disabled || loading}
            style={buttonStyles}
        >
            {loading ? (
                <ActivityIndicator color={isPrimary ? '#FFFFFF' : '#71D5F3'} />
            ) : (
                <Text style={titleStyles}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        width: '100%',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginVertical: 8,
    },
    primaryButton: {
        backgroundColor: '#71D5F3',
    },
    outlineButton: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
    },
    disabledButton: {
        opacity: 0.6,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
    },
    primaryTitle: {
        color: '#FFFFFF',
    },
    outlineTitle: {
        color: '#111827',
    },
});

export default Button;
