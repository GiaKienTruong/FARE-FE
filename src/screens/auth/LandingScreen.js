import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
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

const ONBOARDING_DATA = [
    {
        id: '1',
        title: 'Modern &\nMinimal',
        description: '"ALL YOUR CLOTHES. ORGANISED. SIMPLE. STYLISH."',
        image: require('../../../src/assets/onboarding/slide1.png'),
    },
    {
        id: '2',
        title: 'Fashion-\nfocused',
        description: '"YOUR WARDROBE IS MORE THAN STORAGE — IT\'S YOUR STYLE."',
        image: require('../../../src/assets/onboarding/slide2.png'),
    },
    {
        id: '3',
        title: "Let's Get\nStyled",
        description: 'Let us help you organize your wardrobe and discover new outfit ideas',
        image: require('../../../src/assets/onboarding/slide3.png'),
    },
];

const LandingScreen = ({ navigation }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef(null);

    const viewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems && viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const scrollToNext = () => {
        if (currentIndex < ONBOARDING_DATA.length - 1) {
            slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
        }
    };

    const renderItem = ({ item }) => {
        return (
            <View style={styles.slide}>
                <Image source={item.image} style={styles.backgroundImage} resizeMode="cover" />
                <View style={styles.overlay} />
                <View style={styles.textContainer}>
                    <Text style={styles.slideTitle}>{item.title}</Text>
                    <Text style={styles.slideDescription}>{item.description}</Text>
                </View>
            </View>
        );
    };

    const Paginator = () => {
        return (
            <View style={styles.paginatorContainer}>
                {ONBOARDING_DATA.map((_, i) => {
                    const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
                    const dotWidth = scrollX.interpolate({
                        inputRange,
                        outputRange: [10, 40, 10],
                        extrapolate: 'clamp',
                    });
                    const opacity = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.3, 1, 0.3],
                        extrapolate: 'clamp',
                    });
                    return (
                        <Animated.View
                            key={i.toString()}
                            style={[styles.dot, { width: dotWidth, opacity }]}
                        />
                    );
                })}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <FlatList
                data={ONBOARDING_DATA}
                renderItem={renderItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                bounces={false}
                keyExtractor={(item) => item.id}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                    useNativeDriver: false,
                })}
                onViewableItemsChanged={viewableItemsChanged}
                viewabilityConfig={viewConfig}
                ref={slidesRef}
            />

            <SafeAreaView style={styles.controlsContainer}>
                {currentIndex < ONBOARDING_DATA.length - 1 ? (
                    <View style={styles.footerRow}>
                        <Paginator />
                        <TouchableOpacity style={styles.nextButton} onPress={scrollToNext}>
                            <Ionicons name="arrow-forward" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.actionSection}>
                        <Button
                            title="Log in"
                            onPress={() => navigation.navigate('Welcome')}
                            style={styles.loginButton}
                            textStyle={styles.loginButtonText}
                        />
                        <Button
                            title="Sign up"
                            onPress={() => navigation.navigate('Welcome')}
                            style={styles.signupButton}
                            textStyle={styles.signupButtonText}
                        />
                    </View>
                )}
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    slide: {
        width,
        height,
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    textContainer: {
        position: 'absolute',
        bottom: 250,
        left: 40,
        right: 40,
    },
    slideTitle: {
        fontSize: 44,
        fontWeight: '900',
        color: '#FFFFFF',
        marginBottom: 12,
        lineHeight: 52,
    },
    slideDescription: {
        fontSize: 14,
        color: '#FFFFFF',
        opacity: 0.8,
        lineHeight: 20,
        fontWeight: '500',
    },
    controlsContainer: {
        position: 'absolute',
        bottom: 60,
        left: 0,
        right: 0,
        paddingHorizontal: 40,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    paginatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dot: {
        height: 4,
        borderRadius: 2,
        backgroundColor: '#FFFFFF',
        marginHorizontal: 4,
    },
    nextButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#111827',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    actionSection: {
        width: '100%',
        gap: 16,
    },
    loginButton: {
        backgroundColor: '#71D5F3',
        height: 56,
        borderRadius: 12,
        borderWidth: 0,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    signupButton: {
        backgroundColor: '#FFFFFF',
        height: 56,
        borderRadius: 12,
        borderWidth: 0,
    },
    signupButtonText: {
        color: '#111827',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default LandingScreen;
