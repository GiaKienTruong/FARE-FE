import { StyleSheet, View } from 'react-native';

const ProgressBar = ({ currentStep, totalSteps = 3 }) => {
    return (
        <View style={styles.container}>
            {[...Array(totalSteps)].map((_, index) => (
                <View
                    key={index}
                    style={[
                        styles.segment,
                        index + 1 <= currentStep ? styles.activeSegment : styles.inactiveSegment,
                    ]}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        gap: 8,
    },
    segment: {
        height: 4,
        width: 30, // Approximate width from Figma
        borderRadius: 2,
    },
    activeSegment: {
        backgroundColor: '#71D5F3',
    },
    inactiveSegment: {
        backgroundColor: '#E5E7EB',
    },
});

export default ProgressBar;
