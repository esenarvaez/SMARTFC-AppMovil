import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, Button, Alert } from 'react-native';
import API from '../../utils/api';
import { Rating } from 'react-native-ratings';
import { connect } from 'react-redux';
class RatingStart extends Component {
    constructor(props, ipconfig) {
        super(props);
    }
    state = {
        isVisible: false,
        ipconfig: null
    }
    data = [
        {
            id_qalify: 1,
            Default_Rating: 0,
            description: 'Contenido'
        },
        {
            id_qalify: 2,
            Default_Rating: 0,
            description: 'Calidad'
        },
        {
            id_qalify: 3,
            Default_Rating: 0,
            description: 'Diseño'
        },
        {
            id_qalify: 4,
            Default_Rating: 0,
            description: 'Motivación'
        },
        {
            id_qalify: 5,
            Default_Rating: 0,
            description: 'Audio'
        },
    ];
    UpdateRating(rating, id) {
        this.data[id - 1].defaultRating = rating;
    }
    async sendReview() {
        if (this.validateSelectedRating()) {
            var sendReview = await API.updateRatingActivity(this.props.ipconfig, this.data, this.props._id);
        } else {
            Alert.alert(
                '',
                'Para reseñar un video necesitas seleccionar una calificación',
                [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false }
            );
        }
    }

    validateSelectedRating() {
        let cont = 0;
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].defaultRating > 0) {
                cont++;
            }
        }
        if (cont > 0) {
            return true;
        }
        return false;
    }
    render() {
        this.state.ipconfig = this.props.ipconfig;
        return (
            <View style={styles.contentBtnReview}>
                <TouchableOpacity
                    style={styles.btnreview}
                    onPress={() => { this.setState({ isVisible: true }) }}
                >
                    <Text style={styles.reviewText}>Reseñar video</Text>
                </TouchableOpacity>
                <Modal
                    animationType={"fade"}
                    transparent={false}
                    visible={this.state.isVisible}
                    onRequestClose={() => { console.log("Modal has been closed.") }}>
                    {/*All views of Modal*/}
                    <View style={styles.modal}>
                        <Text style={styles.text}>¿Como evaluaría su satisfacción respecto al video?</Text>
                        <View style={styles.container}>
                            <View style={styles.item}>
                                {this.data.map((item) => (
                                    <Text key={item.id_qalify}>{item.description}</Text>
                                ))}
                            </View>
                            <View style={styles.item}>
                                {this.data.map((data) => (
                                    <Rating type='custom'
                                        ratingColor='#FFC300'
                                        ratingBackgroundColor='#E2E3E3'
                                        ratingCount={5}
                                        imageSize={20}
                                        onFinishRating={(rating) => { this.UpdateRating(rating, data.id_qalify) }}
                                        key={data.id_qalify}
                                        startingValue={0}
                                    />
                                ))}
                            </View>
                            <View style={styles.item}>
                                <Button title="Cancelar" onPress={() => {
                                    this.setState({ isVisible: !this.state.isVisible })
                                }}
                                />
                            </View>
                            <View style={styles.item}>
                                <Button title="Calificar" onPress={() => this.sendReview()}
                                />
                            </View>
                        </View>

                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff'

    },
    btnreview: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderColor: '#fff'
    },
    reviewText: {
        color: '#FFC300',
        textAlign: 'center'
    },
    contentBtnReview: {
        backgroundColor: '#FFC300',
        padding: 5,
        marginTop: 20
    },
    btnQualify: {
        textAlign: 'center'
    },
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start'
    },
    item: {
        padding: 2,
        width: '50%',

    },
    childView: {
        justifyContent: 'center',
        flexDirection: 'row'
    },
    StarImage: {
        width: 20,
        height: 20,
        resizeMode: 'cover',
    }
});

function mapStateToProps(state) {
    return {
        ipconfig: state.videos.selectedIPConfig
    }
}
export default connect(mapStateToProps)(RatingStart);
