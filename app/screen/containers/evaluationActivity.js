import React,{Component} from 'react';
import HeaderReturn from '../../components/headerReturn';
import {NavigationActions} from 'react-navigation';
import ContenidoLayout from '../components/detailActivity';
import { StyleSheet,Button, Text, ScrollView, Alert} from 'react-native';
import {Animated} from 'react-native';
import {connect} from 'react-redux';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import * as SQLite from 'expo-sqlite';
import API from '../../../utils/api';
//import Audio from '../../containers/audio-activity';

const db = SQLite.openDatabase("db5.db");

class evaluationActivity extends Component{
    state={
        opacity:new Animated.Value(0),
        value1:0,
        value2:0,
        value3:0,
        storage: null,
        storageFilter:null,
        storageFlats: null,
    }
    static navigationOptions=({navigation})=>{
        return{ 
            header: (<HeaderReturn onPress={()=>navigation.goBack()}>Realiza tu Examen</HeaderReturn>)
        }
    }
    componentDidMount(){
        Animated.timing(
            this.state.opacity,{
                toValue:1,
                duration:1000,
            }
        ).start();
        db.transaction(tx => {
            tx.executeSql(
              "create table if not exists events (id_evento integer primary key not null, data_start text, hour_start text, data_end text, hour_end text, id_actividad int, id_estudiante int, check_download int, check_inicio int, check_fin int, check_answer int, count_video int, check_video int, check_document int, check_a1 int, check_a2 int, check_a3 int, check_profile int, check_Ea1 int, check_Ea2 int, check_Ea3 int );"
            );
            tx.executeSql(
                "create table if not exists flatEvent (id_evento integer not null, upload int);"
              );
            tx.executeSql("select * from events", [], (_, { rows:{ _array } }) =>
                this.setState({ storage: _array })
            );
            tx.executeSql(
                `select * from flatEvent ;`,
                [],
                (_, { rows: { _array } }) => this.setState({ storageFlats: _array })
              );
              tx.executeSql(
                `select * from events where id_estudiante=? and id_actividad=?;`,
                  [this.props.student.id_estudiante,this.props.activity.id_actividad],
                (_, { rows: { _array } }) => this.setState({ storageFilter: _array })
              );
        });

    }
    updateFlat(){
        db.transaction(tx => {
            tx.executeSql(
              `select * from flatEvent ;`,
              [],
              (_, { rows: { _array } }) => this.setState({ storageFlats: _array })
            );
          });
        console.log(this.state.storageFlats);
    }
    update() {
        db.transaction(tx => {
          tx.executeSql(
            `select * from events ;`,
            [],
            (_, { rows: { _array } }) => this.setState({ storage: _array })
          );
        });
        console.log(this.state.storage[this.state.storage.length-1]);
        db.transaction(
            tx => {
              tx.executeSql(`insert into flatEvent (id_evento, upload) values (?, ?)`,
              [this.state.storage[this.state.storage.length-1].id_evento,0]);
            },
            null,
            null
        );
        db.transaction(tx => {
            tx.executeSql(
              `select * from flatEvent ;`,
              [],
              (_, { rows: { _array } }) => this.setState({ storageFlats: _array })
            );
          });
          this.updateFlat();
      }
    storageTest(){
        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        var dataComplete = date+'/'+month+'/'+year;
        var hours = new Date().getHours();
        var min = new Date().getMinutes();
        var hoursComplete = hours+':'+min;
        db.transaction(tx => {
            tx.executeSql(
              `select * from events where id_estudiante=? and id_actividad=?;`,
                [this.props.student.id_estudiante,this.props.activity.id_actividad],
              (_, { rows: { _array } }) => this.setState({ storageFilter: _array })
            );
        });
        console.log(this.state.storageFilter);

        var storageFilterGood = this.state.storageFilter;
        var storageFilter = storageFilterGood.reverse();
        if(storageFilter.length==0){
          console.log("Entro a Cero")
            resultado = [{
              check_a1: 0,
              check_a2: 0,
              check_a3: 0,
              check_inicio: 0,
              check_video:0,
              count_video:0,
              check_answer: 0,
              check_download:0
            }]
            
            console.log(resultado[0])
        }
      if (storageFilter.length != 0) {
        resultado = Array.from(new Set(storageFilter.map(s => s.id_actividad)))
          .map(id_actividad => {
            return {
              id_actividad: id_actividad,
              data_start: storageFilter.find(s => s.id_actividad === id_actividad).data_start,
              check_video: storageFilter.find(s => s.id_actividad === id_actividad).check_video,
              count_video: storageFilter.find(s => s.id_actividad === id_actividad).count_video,
              check_a1: storageFilter.find(s => s.id_actividad === id_actividad).check_a1,
              check_a2: storageFilter.find(s => s.id_actividad === id_actividad).check_a2,
              check_a3: storageFilter.find(s => s.id_actividad === id_actividad).check_a3,
              check_answer: storageFilter.find(s => s.id_actividad === id_actividad).check_answer,
              check_download: storageFilter.find(s => s.id_actividad === id_actividad).check_download,
              check_inicio: storageFilter.find(s => s.id_actividad === id_actividad).check_inicio,
              id_evento: storageFilter.find(s => s.id_actividad === id_actividad).id_evento,
            };
          });
      }

        db.transaction(
            tx => {
              tx.executeSql("insert into events (data_start, hour_start, data_end, hour_end, id_actividad, id_estudiante, check_download, check_inicio, check_fin, check_answer, count_video, check_video, check_document, check_a1, check_a2, check_a3, check_profile, check_Ea1, check_Ea2, check_Ea3) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)",
               [dataComplete,hoursComplete,dataComplete,hoursComplete, this.props.activity.id_actividad, this.props.student.id_estudiante,resultado[0].check_download,resultado[0].check_inicio,0,resultado[0].check_answer,resultado[0].count_video,resultado[0].check_video,0,resultado[0].check_a1,resultado[0].check_a2,resultado[0].check_a3,0,this.state.value1,this.state.value2,this.state.value3]);
            },
            null,
            null
        );
        db.transaction(tx => {
            tx.executeSql(
              `select * from events ;`,
                [],
              (_, { rows: { _array } }) => this.setState({ storage: _array })
            );
        });
        //console.log(this.state.storage [this.state.storage.length-1]);
        this.update();
        Alert.alert(
          'Almacenamiento Exitoso',
          'Sus respuestas han sido almacenadas recuerde sincronizar con su servidor cuando este en el colegio',
          [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ],
          { cancelable: false }
      );
    }
    consulta(){  
      db.transaction(tx => {
            tx.executeSql(
              `select * from events ;`,
                [],
              (_, { rows: { _array } }) => this.setState({ storage: _array })
            );
            tx.executeSql(
                `select * from flatEvent ;`,
                [],
                (_, { rows: { _array } }) => this.setState({ storageFlats: _array })
            );
      });
      console.log(this.state.storageFlats);
    }
    async sendServer (){
        //this.consulta();
        db.transaction(tx => {
            tx.executeSql(
              `select * from events ;`,
                [],
              (_, { rows: { _array } }) => this.setState({ storage: _array })
            );
            tx.executeSql(
                `select * from flatEvent ;`,
                [],
                (_, { rows: { _array } }) => this.setState({ storageFlats: _array })
              );
        });
        //this.updateFlat();
        var data = this.state.storage;
        var Flats = this.state.storageFlats;

        console.log("Trayendo Flats");
        console.log(this.state.storage);
        for(var i = 0; i<Flats.length; i++){
            if(Flats[i].upload==0){
                for(var j=0; j<data.length; j++){
                    if(Flats[i].id_evento == data[j].id_evento){
                        var queryApi = await API.loadEventsLast(this.props.ipconfig);
                        queryApi = queryApi+1;
                        //var idEvens = queryApi.length;
                        console.log("Existe un error")
                        console.log(queryApi.length);
                        var id_estudianteF = ""+ this.props.student.id_estudiante + queryApi;
                        var id_estudianteF = parseInt(id_estudianteF);
                        data[j].id_evento= id_estudianteF;
                        var id_eventoFs = Flats[j].id_evento;
                        //console.log("ID EVENTOS");
                        //console.log(id_eventoFs);
                        db.transaction(tx => {
                            tx.executeSql(
                              `update flatEvent set upload = ? where id_evento = ? ;`,[1,id_eventoFs]);
                            tx.executeSql("select * from flatEvent", [], (_, { rows: { _array } }) =>
                                console.log(_array)
                            );
                        });
                        var dataEvents = data[j];
                        var query2 = await API.createEvents(this.props.ipconfig,dataEvents);
                    }
                }
            }
            
        }
        console.log(data);
        console.log(query2);
        Alert.alert(
          'Sincronizaci??n exitosa',
          'La sincronizaci??n de respuestas fue exitosa',
          [
              { text: 'OK', onPress: () => console.log('OK Pressed') },
          ],
          { cancelable: false }
      );
    }
    render(){
        console.log("Trayendo al Estudiante");
        console.log(this.props.student.id_estudiante);
        var Question_One = [
            {label: this.props.activity.EA11, value: 1 },
            {label: this.props.activity.EA12, value: 2 },
            {label: this.props.activity.EA13, value: 3 },
            {label: this.props.activity.EA14, value: 4 }
        ];
        var Question_Two = [
            {label: this.props.activity.EA21, value: 1 },
            {label: this.props.activity.EA22, value: 2 },
            {label: this.props.activity.EA23, value: 3 },
            {label: this.props.activity.EA24, value: 4 }
        ];
        var Question_Three = [
            {label: this.props.activity.EA31, value: 1 },
            {label: this.props.activity.EA32, value: 2 },
            {label: this.props.activity.EA33, value: 3 },
            {label: this.props.activity.EA34, value: 4 }
        ];
        console.log("Abriendo PlayContents")
        console.log(this.props.activity.video);
        return (
            <ScrollView style={styles.container}>
                <Text style={styles.texto}>{this.props.activity.EQ1}</Text>
                <RadioForm
                    radio_props={Question_One}
                    initial={0}
                    onPress={(value) => { this.setState({ value1: value }) }}
                    labelColor={'#9C9C9C'}
                />
                <Text style={styles.texto}>{this.props.activity.EQ2}</Text>
                <RadioForm
                    radio_props={Question_Two}
                    initial={0}
                    onPress={(value) => { this.setState({ value2: value }) }}
                    labelColor={'#9C9C9C'}
                />
                <Text style={styles.texto}>{this.props.activity.EQ3}</Text>
                <RadioForm
                    radio_props={Question_Three}
                    initial={0}
                    onPress={(value) => { this.setState({ value3: value }) }}
                    labelColor={'#9C9C9C'}
                />
                <Button title="Guardar" style={styles.buttonstyle} onPress={()=>this.storageTest()}/>
                
                <Button title="Sincronizar" style={styles.buttonstyle} onPress={()=>this.sendServer()}/>
            </ScrollView>
        );
        
    }
}
function mapStateToProps(state){
    return{
        activity:state.videos.selectedActivity, 
        student:state.videos.selectedStudent,
        ipconfig: state.videos.selectedIPConfig
    }
}
const styles = StyleSheet.create({
    container:{
        marginLeft: 15,
        marginRight:15
    },
    texto:{
        fontWeight:'bold',
        fontSize: 16,
        marginTop: 10,
        marginBottom:10, 
    },
    buttonstyle:{
        padding:20,
        margin:20,
        paddingTop:20,
        marginTop: 30,

    }
})
export default connect(mapStateToProps)(evaluationActivity);