import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, Image, TextInput, Alert, ImageBackground, Modal, ScrollView } from "react-native";
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { styles } from "./styles";
import fundo from '../../../assets/fundologin.png';
import { Ionicons } from '@expo/vector-icons';

// ========== CONFIGURAÇÃO DO IDIOMA PORTUGUÊS ==========
LocaleConfig.locales['pt'] = {
  monthNames: [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ],
  monthNamesShort: [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ],
  dayNames: [
    'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
    'Quinta-feira', 'Sexta-feira', 'Sábado'
  ],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt';

const AVATAR_OPTIONS = [
    "https://xktxdedjpidgulnzykxq.supabase.co/storage/v1/object/public/avatars/1.png",
    "https://xktxdedjpidgulnzykxq.supabase.co/storage/v1/object/public/avatars/2.png",
    "https://xktxdedjpidgulnzykxq.supabase.co/storage/v1/object/public/avatars/3.png",
    "https://xktxdedjpidgulnzykxq.supabase.co/storage/v1/object/public/avatars/4.png",
];

const GENERO_OPTIONS = ["Masculino", "Feminino", "Outro", "Prefiro não dizer"];

export default function Step2Profile({ navigation, route }) {
    const formData = route.params?.formData || {};
    const [nome, setNome] = useState(formData.nome || '');
    const [genero, setGenero] = useState(formData.genero || '');
    const [telefone, setTelefone] = useState(formData.telefone || '');
    const [dataNascimento, setDataNascimento] = useState(formData.data_nascimento || '');
    const [foto, setFoto] = useState(formData.foto || '');
    const [avatarModalVisible, setAvatarModalVisible] = useState(false);
    const [calendarModalVisible, setCalendarModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(dataNascimento || '');
    const [showYearSelector, setShowYearSelector] = useState(false);
    const [currentMonth, setCurrentMonth] = useState('');

    const avatarChoices = useMemo(() => AVATAR_OPTIONS.map(url => ({ url, path: url })), []);

    // DEBUG: Verificar se a data está sendo passada corretamente
    React.useEffect(() => {
        console.log('🔍 DEBUG Step2Profile - formData atual:', {
            dataNascimento,
            todosDados: formData
        });
    }, [dataNascimento, formData]);

    const handleNext = () => {
        console.log('✅ Finalizando Step2Profile - dados a serem enviados:', {
            dataNascimento,
            nome,
            genero,
            telefone,
            foto
        });

        if (!nome.trim()) { Alert.alert('Atenção', 'Por favor, preencha seu nome.'); return; }
        if (!foto) { Alert.alert('Atenção', 'Por favor, selecione um avatar.'); return; }
        if (!telefone.trim()) { Alert.alert('Atenção', 'Por favor, preencha seu telefone.'); return; }
        if (!genero) { Alert.alert('Atenção', 'Por favor, selecione um gênero.'); return; }
        if (!dataNascimento) { Alert.alert('Atenção', 'Por favor, selecione sua data de nascimento.'); return; }

        navigation.navigate('Step3Pergunta', {
            formData: { 
                ...formData, 
                nome: nome.trim(), 
                genero, 
                telefone: telefone.trim(), 
                data_nascimento: dataNascimento, // ✅ Já está no formato YYYY-MM-DD
                foto 
            }
        });
    };

    const handleDateSelect = (day) => {
        const selectedDateString = day.dateString; // Formato YYYY-MM-DD
        console.log('📅 Data selecionada:', selectedDateString);
        setSelectedDate(selectedDateString);
        // Não setamos dataNascimento aqui ainda - só no confirmar
    };

    const confirmDateSelection = () => {
        if (selectedDate) {
            console.log('✅ Data confirmada:', selectedDate);
            setDataNascimento(selectedDate); // ✅ Agora sim seta no formData
            setCalendarModalVisible(false);
        } else {
            Alert.alert('Atenção', 'Por favor, selecione uma data.');
        }
    };

    const formatDisplayDate = (dateString) => {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    const calculateAge = (dateString) => {
        if (!dateString) return 0;
        const birthDate = new Date(dateString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    // Configurar datas máximas e mínimas (idade entre 10 e 100 anos)
    const today = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(today.getFullYear() - 10); // Mínimo 10 anos
    
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 100); // Máximo 100 anos

    // Calcular ano inicial sugerido (30 anos atrás)
    const initialDate = new Date();
    initialDate.setFullYear(today.getFullYear() - 30);

    // Gerar lista de anos para o seletor (dos últimos 100 anos até 10 anos atrás)
    const years = Array.from({ length: 91 }, (_, i) => today.getFullYear() - 10 - i);

    const handleYearSelect = (year) => {
        // Manter o mês atual, mas mudar o ano
        const current = new Date(currentMonth || initialDate);
        current.setFullYear(year);
        setCurrentMonth(current.toISOString().split('T')[0]);
        setShowYearSelector(false);
    };

    const handleMonthChange = (month) => {
        setCurrentMonth(month.dateString);
    };

    const handleChooseAvatar = (choice) => {
        setFoto(choice.path);
        setAvatarModalVisible(false);
    };

    const formatTelefone = (text) => {
        const digits = text.replace(/\D/g, '');
        if (digits.length <= 2) return `(${digits}`;
        if (digits.length <= 6) return `(${digits.slice(0,2)}) ${digits.slice(2)}`;
        if (digits.length <= 10) return `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6)}`;
        return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7,11)}`;
    };

    return (
        <ImageBackground source={fundo} resizeMode="cover" style={{ flex: 1 }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <View style={[styles.card, { alignItems: 'center', paddingVertical: 30 }]}>
                    {/* Avatar */}
                    <TouchableOpacity
                        onPress={() => setAvatarModalVisible(true)}
                        style={{
                            width: 120,
                            height: 120,
                            borderRadius: 60,
                            borderWidth: 2,
                            borderColor: '#17285D',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 20,
                            overflow: 'hidden',
                        }}
                    >
                        {foto ? (
                            <Image source={{ uri: foto }} style={{ width: 120, height: 120 }} />
                        ) : (
                            <Text style={{ fontSize: 30, color: '#17285D' }}>+</Text>
                        )}
                    </TouchableOpacity>

                    <Text style={{ fontSize: 15, fontFamily: 'Poppins_700Bold', color: '#17285D', marginBottom: 15 }}>Preencha alguns dados!!!</Text>

                    {/* Nome */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={[styles.input]}
                            placeholder="Nome *"
                            value={nome}
                            onChangeText={setNome}
                        />
                    </View>

                    {/* Data de Nascimento com Calendário */}
                    <TouchableOpacity 
                        style={[styles.inputContainer, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}
                        onPress={() => {
                            setSelectedDate(dataNascimento);
                            setCurrentMonth(dataNascimento || initialDate.toISOString().split('T')[0]);
                            setCalendarModalVisible(true);
                        }}
                    >
                        <Text style={[styles.input, { color: dataNascimento ? '#000' : '#999', flex: 1 }]}>
                            {dataNascimento ? formatDisplayDate(dataNascimento) : 'Data de Nascimento *'}
                        </Text>
                        <Ionicons name="calendar-outline" size={24} color="#17285D" style={{ marginRight: 10 }} />
                    </TouchableOpacity>
                    
                    {dataNascimento ? (
                        <Text style={{ 
                            fontSize: 12, 
                            color: '#17285D', 
                            marginTop: -10, 
                            marginBottom: 10,
                            fontFamily: 'Poppins_400Regular'
                        }}>
                            Idade: {calculateAge(dataNascimento)} anos
                        </Text>
                    ) : null}

                    {/* Telefone com máscara */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={[styles.input]}
                            placeholder="Telefone *"
                            value={telefone}
                            onChangeText={t => setTelefone(formatTelefone(t))}
                            keyboardType="phone-pad"
                            maxLength={15}
                        />
                    </View>

                    {/* Seleção de gênero */}
                    <Text style={{ fontSize: 15, fontFamily: 'Poppins_400Regular', color: '#17285D', marginBottom: 7 }}>Selecione seu gênero:</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 25 }}>
                        {GENERO_OPTIONS.map(opt => (
                            <TouchableOpacity
                                key={opt}
                                onPress={() => setGenero(opt)}
                                style={{
                                    paddingVertical: 10,
                                    paddingHorizontal: 15,
                                    margin: 5,
                                    borderRadius: 12,
                                    borderWidth: 1,
                                    borderColor: '#17285D',
                                    backgroundColor: genero === opt ? '#8ec0c7' : '#fff',
                                    elevation: 2,
                                }}
                            >
                                <Text style={{ color: genero === opt ? '#fff' : '#17285D', fontFamily: 'Poppins_400Regular' }}>
                                    {opt}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleNext}>
                        <Text style={styles.buttonText}>Próximo</Text>
                    </TouchableOpacity>
                </View>

                {/* Modal de avatar */}
                <Modal visible={avatarModalVisible} transparent animationType="fade">
                    <View style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <View style={{
                            backgroundColor: '#fff',
                            borderRadius: 20,
                            padding: 20,
                            width: '85%',
                            alignItems: 'center',
                        }}>
                            <Text style={{ fontSize: 20, marginBottom: 10, fontFamily: 'Poppins_700Bold', color: '#17285D' }}>Escolha seu avatar</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                                {avatarChoices.map(opt => (
                                    <TouchableOpacity
                                        key={opt.path}
                                        onPress={() => handleChooseAvatar(opt)}
                                        style={{ margin: 10 }}
                                    >
                                        <Image source={{ uri: opt.url }} style={{ 
                                            width: 100, 
                                            height: 100, 
                                            borderRadius: 10, 
                                            borderColor: '#17285D', 
                                            borderWidth: 1, 
                                            elevation: 2 
                                          }} />
                                    </TouchableOpacity>
                                ))}
                            </View>
                            
                            <TouchableOpacity
                                onPress={() => setAvatarModalVisible(false)}
                                style={{ 
                                  marginTop: 20, 
                                  padding: 10, 
                                  paddingHorizontal: 20, 
                                  backgroundColor: '#8ec0c7', 
                                  borderRadius: 10, 
                                  borderColor: '#17285D', 
                                  borderWidth: 1,
                                  elevation: 2}}
                            >
                                <Text style={{ color: '#17285D', fontFamily: 'Poppins_700Bold' }}>Fechar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* Modal do Calendário com Seletor de Ano */}
                <Modal visible={calendarModalVisible} transparent animationType="fade">
                    <View style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 20
                    }}>
                        <View style={{
                            backgroundColor: '#fff',
                            borderRadius: 20,
                            padding: 20,
                            width: '100%',
                            maxWidth: 400,
                            alignItems: 'center',
                            maxHeight: '90%'
                        }}>
                            <Text style={{ 
                                fontSize: 18, 
                                marginBottom: 15, 
                                fontFamily: 'Poppins_700Bold', 
                                color: '#17285D' 
                            }}>
                                Selecione sua data de nascimento
                            </Text>
                            
                            {/* Botão para abrir seletor de ano */}
                            {!showYearSelector && (
                                <TouchableOpacity 
                                    onPress={() => setShowYearSelector(true)}
                                    style={{ 
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        padding: 10,
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: 8,
                                        borderWidth: 1,
                                        borderColor: '#17285D',
                                        marginBottom: 10,
                                        alignSelf: 'flex-start',
                                        elevation: 2,
                                        
                                    }}
                                >
                                    <Ionicons name="calendar" size={16} color="#17285D" />
                                    <Text style={{ 
                                        marginLeft: 5, 
                                        color: '#17285D', 
                                        fontFamily: 'Poppins_400Regular',
                                        fontSize: 14
                                    }}>
                                        Pular para ano específico
                                    </Text>
                                </TouchableOpacity>
                            )}

                            {/* Seletor de Ano */}
                            {showYearSelector ? (
                                <View style={{ width: '100%', marginBottom: 15 }}>
                                    <Text style={{ 
                                        fontFamily: 'Poppins_400Regular', 
                                        color: '#17285D', 
                                        marginBottom: 10,
                                        fontSize: 16
                                    }}>
                                        Selecione o ano:
                                    </Text>
                                    <ScrollView 
                                        style={{ maxHeight: 200 }}
                                        showsVerticalScrollIndicator={true}
                                    >
                                        <View style={{ 
                                            flexDirection: 'row', 
                                            flexWrap: 'wrap',
                                            justifyContent: 'space-between'
                                        }}>
                                            {years.map((year) => (
                                                <TouchableOpacity
                                                    key={year}
                                                    onPress={() => handleYearSelect(year)}
                                                    style={{
                                                        width: '23%',
                                                        padding: 12,
                                                        margin: 2,
                                                        backgroundColor: '#f8f9fa',
                                                        borderRadius: 8,
                                                        alignItems: 'center',
                                                        borderWidth: 1,
                                                        borderColor: '#e9ecef',
                                                    }}
                                                >
                                                    <Text style={{ 
                                                        fontFamily: 'Poppins_400Regular', 
                                                        color: '#17285D',
                                                        fontSize: 14
                                                    }}>
                                                        {year}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </ScrollView>
                                    <TouchableOpacity 
                                        onPress={() => setShowYearSelector(false)}
                                        style={{
                                            marginTop: 10,
                                            padding: 10,
                                            backgroundColor: '#8ec0c7',
                                            borderRadius: 8,
                                            alignItems: 'center',
                                            borderWidth: 1,
                                            borderColor: '#17285D'
                                        }}
                                    >
                                        <Text style={{ 
                                            color: '#17285D', 
                                            fontFamily: 'Poppins_400Regular' 
                                        }}>
                                            Voltar ao calendário
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <Calendar
                                    onDayPress={handleDateSelect}
                                    current={currentMonth}
                                    onMonthChange={handleMonthChange}
                                    markedDates={
                                        selectedDate ? {
                                            [selectedDate]: {
                                                selected: true, 
                                                selectedColor: '#8ec0c7',
                                                selectedTextColor: '#17285D'
                                            }
                                        } : {}
                                    }
                                    minDate={minDate.toISOString().split('T')[0]}
                                    maxDate={maxDate.toISOString().split('T')[0]}
                                    enableSwipeMonths={true}
                                    hideExtraDays={true}
                                    firstDay={1}
                                    // CONFIGURAÇÃO EM PORTUGUÊS
                                    monthFormat={'MMMM yyyy'}
                                    theme={{
                                        backgroundColor: '#ffffff',
                                        calendarBackground: '#ffffff',
                                        textSectionTitleColor: '#17285D',
                                        selectedDayBackgroundColor: '#8ec0c7',
                                        selectedDayTextColor: '#17285D',
                                        todayTextColor: '#8ec0c7',
                                        dayTextColor: '#17285D',
                                        textDisabledColor: '#d9e1e8',
                                        dotColor: '#8ec0c7',
                                        selectedDotColor: '#ffffff',
                                        arrowColor: '#8ec0c7',
                                        monthTextColor: '#17285D',
                                        indicatorColor: '#8ec0c7',
                                        textDayFontFamily: 'Poppins_400Regular',
                                        textMonthFontFamily: 'Poppins_700Bold',
                                        textDayHeaderFontFamily: 'Poppins_600SemiBold',
                                        textDayFontSize: 16,
                                        textMonthFontSize: 16,
                                        textDayHeaderFontSize: 14,
                                    }}
                                    style={{
                                        borderRadius: 10,
                                        width: '100%'
                                    }}
                                />
                            )}

                            {/* Data selecionada e botões de ação - CENTRALIZADOS */}
                            {!showYearSelector && (
                                <View style={{ 
                                    width: '100%',
                                    marginTop: 15,
                                    alignItems: 'center' // ✅ Centraliza tudo
                                }}>
                                    {/* Texto da data selecionada */}
                                    <Text style={{ 
                                        fontFamily: 'Poppins_400Regular', 
                                        color: '#17285D',
                                        fontSize: 14,
                                        marginBottom: 15,
                                        textAlign: 'center'
                                    }}>
                                        {selectedDate ? `Data selecionada: ${formatDisplayDate(selectedDate)}` : 'Nenhuma data selecionada'}
                                    </Text>
                                    
                                    {/* Botões centralizados */}
                                    <View style={{ 
                                        flexDirection: 'row', 
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: '100%'
                                    }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setCalendarModalVisible(false);
                                                setShowYearSelector(false);
                                            }}
                                            style={{ 
                                                paddingVertical: 12,
                                                paddingHorizontal: 20,
                                                backgroundColor: '#f8f9fa', 
                                                borderRadius: 8, 
                                                borderColor: '#17285D', 
                                                borderWidth: 1,
                                                marginRight: 15,
                                                minWidth: 100,
                                                alignItems: 'center'
                                            }}
                                        >
                                            <Text style={{ 
                                                color: '#17285D', 
                                                fontFamily: 'Poppins_700Bold',
                                                fontSize: 14
                                            }}>
                                                Cancelar
                                            </Text>
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity
                                            onPress={confirmDateSelection}
                                            style={{ 
                                                paddingVertical: 12,
                                                paddingHorizontal: 20,
                                                backgroundColor: '#8ec0c7', 
                                                borderRadius: 8, 
                                                borderColor: '#17285D', 
                                                borderWidth: 1,
                                                minWidth: 100,
                                                alignItems: 'center'
                                            }}
                                        >
                                            <Text style={{ 
                                                color: '#17285D', 
                                                fontFamily: 'Poppins_700Bold',
                                                fontSize: 14
                                            }}>
                                                Confirmar
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>
                </Modal>
            </View>
        </ImageBackground>
    );
}