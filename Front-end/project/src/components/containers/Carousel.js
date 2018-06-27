import React, { Component } from 'react'
import { StyleSheet, View, StatusBar, Dimensions, ScrollView, Image, Animated } from 'react-native'

// initialize screen size
const { width, height} = Dimensions.get('window');
const SCROLLVIEW_REF = "scrollview"

class Carousel extends Component {
    // initial data
    state = {scrollViewWidth:0, autoPlay:true, width: width}

    constructor(props) {
        super(props)

        this._goToNextSlide = this._goToNextSlide.bind(this);
        this._startAutoPlay = this._startAutoPlay.bind(this);
        this._onScroll = this._onScroll.bind(this);
        this._onScrollViewLayout = this._onScrollViewLayout.bind(this);
        this._stopAutoPlay = this._stopAutoPlay.bind(this);

        this._currentIndex = 0;
    }

    componentDidMount() {
        if(this.state.autoPlay) this._startAutoPlay()
        else this._stopAutoPlay()
    }


    scrollX = new Animated.Value(0);
    render() {
        const { images } = this.props;
        // position will be a value between 0 and photos.length - 1 assuming you don't scroll pass the ends of the ScrollView
        let position = Animated.divide(this.scrollX, width);

        if (images && images.length) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.scrollContainer}>
                        <ScrollView  contentContainerStyle={{alignItems: 'center'}}
                                ref = {SCROLLVIEW_REF}
                                onLayout = {this._onScrollViewLayout}
                                horizontal= {true}
                                pagingEnabled = {true}
                                directionalLockEnabled = {true}
                                showsHorizontalScrollIndicator= {false} 
                                onScroll = {this._onScroll}
                                onScroll={Animated.event( // Animated.event returns a function that takes an array where the first element...
                                    [{ nativeEvent: { contentOffset: { x: this.scrollX } } }] // ... is an object that maps any nativeEvent prop to a variable
                                )} // in this case we are mapping the value of nativeEvent.contentOffset.x to this.scrollX
                                scrollEventThrottle={16} // this will ensure that this ScrollView's onScroll prop is called no faster than 16ms between each function call
                                >
                                { images.map((image, i) => {
                                return  <Image style={styles.image} source={image.source} key={i} resizeMode='cover' />
                                })}
                        </ScrollView>
                    </View>
                    <View
                        style={{ flexDirection: 'row' }} // this will layout our dots horizontally (row) instead of vertically (column)
                        >
                        {images.map((_, i) => { // the _ just means we won't use that parameter
                        let opacity = position.interpolate({
                            inputRange: [i - 0.50000000001, i - 0.5, i, i + 0.5, i + 0.50000000001], // only when position is ever so slightly more than +/- 0.5 of a dot's index...
                            outputRange: [0.3, 1, 1, 1, 0.3], // ... is when the opacity changes from 1 to 0.3
                            extrapolate: 'clamp'
                        });

                        return (
                            <Animated.View // we will animate the opacity of the dots later, so use Animated.View instead of View here
                            key={i} // we will use i for the key because no two (or more) elements in an array will have the same index
                            style={[styles.pageIndicator, {opacity}]}
                            />
                        );
                        })}
                    </View>
                </View>
            );
        }
        
        console.log('images have not been provided');
        return null
    }

    _onScroll(event) {
        console.log("_onScroll got called")
        let {x} = event.nativeEvent.contentOffset, offset, position = Math.floor(x/this.state.scrollViewWidth)
        if(x === this._preScrollX) return;
        this._preScrollX = x;
        offeset = x/this.state.scrollViewWidth - position
    
        if(offset === 0) {
            this._currentIndex = position
            this._timerId = setInterval(this._goToNextSlide, 3000);
        }
    }

    _onScrollViewLayout(event) {
        let { scrollViewWidth } = event.nativeEvent.layout
        this.setState({ scrollViewWidth: scrollViewWidth})
    }
    _goToNextSlide() {
        let nextIndex = (this._currentIndex + 1) % 5;  
        this._currentIndex = nextIndex      
        this.refs[SCROLLVIEW_REF].scrollTo({x: this.state.width * nextIndex})       
    }
    _startAutoPlay() {
        this._timerId = setInterval(this._goToNextSlide, 3000);
    }
    _stopAutoPlay() {
        if(this._timerId) {
            clearinterval(this._timerId)
            this._timerId = null
        }
    }
}

const styles = StyleSheet.create({
    scrollContainer: {
        height: height * 0.4,
        width: width,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    image: {
        width: width,
        height: height * 0.4,
        backgroundColor: '#f1f8ff',
    },

    pageIndicator: {
        height: 10,
        width: 10,
        backgroundColor: '#595959',
        margin: 8,
        borderRadius: 5,
    },
  });



export default Carousel;