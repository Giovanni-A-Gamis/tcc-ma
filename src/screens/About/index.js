import * as React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    LayoutAnimation,
    Platform,
    UIManager,
    ScrollView,
    Image
} from 'react-native';
import { styles } from './styles';
import LottieView from 'lottie-react-native';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

export default function About() {
    const [expandedSection, setExpandedSection] = React.useState(null);
    const [expandedMember, setExpandedMember] = React.useState(null);

    const toggleSection = (section) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedSection(expandedSection === section ? null : section);
        if (section !== 'membros') setExpandedMember(null);
    };

    const toggleMember = (member) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedMember(expandedMember === member ? null : member);
    };

    const sections = [
        { title: 'Resumo', key: 'resumo' },
        { title: 'Objetivo', key: 'objetivo' },
        { title: 'Justificativa', key: 'justificativa' },
        { title: 'Metodologia', key: 'metodologia' },
        { title: 'Membros', key: 'membros' },
        { title: 'Resultados Esperados', key: 'resultados' },
    ];

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Image
                    source={require('../../../assets/traco.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.title}>Sobre o Aplicativo</Text>
            </View>

            {sections.map((section) => (
                <View key={section.key} style={styles.section}>
                    <TouchableOpacity
                        onPress={() => toggleSection(section.key)}
                        style={styles.sectionButton}
                    >
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                    </TouchableOpacity>

                    {expandedSection === section.key && (
                        <View style={styles.sectionContent}>

                           {/* RESUMO */}
                            {section.key === 'resumo' && (
                                <View>
                                    <Text style={styles.text}>
                                        Somos o grupo Memória Ativa, formado por estudantes da ETEC Bento Quirino,
                                        e este projeto integra nosso Trabalho de Conclusão de Curso (TCC).{"\n\n"}
                                        O Memória Ativa é um aplicativo desenvolvido para estimular e fortalecer a memória,
                                        contribuindo também para melhorar o foco e a concentração dos usuários.{"\n\n"}
                                        O aplicativo reúne jogos interativos, atividades cognitivas e guias práticos,
                                        tornando o treino mental mais dinâmico e acessível. Nossa proposta é unir tecnologia
                                        e bem-estar, promovendo o cuidado com a mente de forma leve e eficaz.{"\n\n"}
                                        O mascote do nosso projeto, Memo, é um elefante azul que simboliza a memória, 
                                        visto que os elefantes possuem a maior capacidade de lembrança do reino animal. 
                                        Nosso mascote representa o objetivo do aplicativo de estimular e fortalecer a memória de forma lúdica e amigável, 
                                        criando uma identidade visual memorável e atraente para os usuários.
                                    </Text>
                                </View>
                            )}


                           {/* OBJETIVO */}
                            {section.key === 'objetivo' && (
                                <View>
                                    <Text style={styles.text}>
                                        O objetivo do nosso projeto é auxiliar pessoas que apresentam dificuldades cognitivas relacionadas à memória e atenção, 
                                        oferecendo uma ferramenta digital capaz de estimular o cérebro de forma leve e acessível.{"\n\n"}
                                        Por meio de jogos interativos, atividades mentais, guias e outras funcionalidades, buscamos promover o desenvolvimento cognitivo, 
                                        fortalecer a concentração e reduzir os impactos causados pela perda de memória.{"\n\n"}
                                        Além disso, o projeto tem como propósito incentivar o cuidado com a saúde mental, 
                                        mostrando que é possível treinar e aprimorar as funções da mente de maneira divertida,rápida e prática, 
                                        contribuindo assim para o bem-estar e a qualidade de vida dos usuários, não importando a faixa etária.
                                    </Text>
                                </View>
                            )}


                           {/* JUSTIFICATIVA */}
                            {section.key === 'justificativa' && (
                                <View>
                                    <Text style={styles.text}>
                                        A perda de memória e a dificuldade de concentração são problemas que podem comprometer de forma significativa a qualidade de vida, 
                                        afetando tanto atividades cotidianas quanto o desempenho pessoal e profissional.{"\n\n"}
                                        Esses desafios surgem frequentemente em decorrência de rotinas estressantes, que sobrecarregam a mente e dificultam o foco; 
                                        do envelhecimento natural, que pode reduzir gradualmente a capacidade cognitiva; 
                                        e de doenças cognitivas, que impactam diretamente a memória, o aprendizado e a atenção.{"\n\n"}
                                        O nosso projeto propõe uma solução tecnológica interativa, oferecendo funcionalidades desenvolvidas para estimular o funcionamento cognitivo 
                                        e fortalecer habilidades mentais. Por meio de jogos interativos, atividades cognitivas e guias práticos, buscamos proporcionar uma experiência 
                                        que seja ao mesmo tempo engajadora e educativa, ajudando os usuários a exercitar a mente de maneira acessível e prática.{"\n\n"}
                                        Dessa forma, o projeto visa oferecer uma ferramenta eficaz e de fácil utilização, que contribua para manter e aprimorar a memória, 
                                        fortalecer a concentração e promover o bem-estar mental, ajudando os usuários a lidar com os efeitos do estresse diário, 
                                        do envelhecimento natural e de condições cognitivas, melhorando assim a qualidade de vida.
                                    </Text>
                                </View>
                            )}


                            {/* METODOLOGIA */}
                            {section.key === 'metodologia' && (
                                <View>
                                    <Text style={styles.text}>
                                        O projeto foi estruturado em quatro partes principais: Frontend, Backend, sistema embarcado e pesquisa.{"\n\n"}
                                        A pesquisa teve foco na perda de memória e sua frequência, analisando como isso pode impactar a qualidade de vida 
                                        e a condição humana contemporânea.{"\n\n"}
                                        O design das interfaces foi desenvolvido no Figma, a programação da aplicação em JavaScript, e o bracelete inteligente em C++, 
                                        com um banco de dados PostgreSQL para armazenamento seguro das informações.{"\n\n"}
                                        O desenvolvimento do Memória Ativa seguiu práticas da engenharia de software, estudos sobre memória humana 
                                        e a metodologia Kanban para organização das tarefas.{"\n\n"}
                                        O projeto foi dividido em algumas etapas: levantamento de requisitos, prototipação, desenvolvimento do aplicativo, 
                                        integração com o bracelete via Bluetooth e testes com foco no usuário. As atividades cognitivas foram baseadas 
                                        em pesquisas sobre estímulo e retenção de memória, garantindo uma aplicação eficaz e prática.
                                    </Text>
                                </View>
                            )}


                            {/* MEMBROS */}
                            {section.key === 'membros' && (
                                <View>
                                    {/* FELIPE */}
                                    <TouchableOpacity
                                        onPress={() => toggleMember('felipe')}
                                        style={styles.memberButton}
                                    >
                                        <Text style={styles.memberName}>Felipe Pedroso Cantanhede</Text>
                                    </TouchableOpacity>
                                    {expandedMember === 'felipe' && (
                                        <Text style={styles.memberText}>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                        </Text>
                                    )}

                                    {/* GIOVANNI */}
                                    <TouchableOpacity
                                        onPress={() => toggleMember('giovanni')}
                                        style={styles.memberButton}
                                    >
                                        <Text style={styles.memberName}>Giovanni Alcaraz Gamis</Text>
                                    </TouchableOpacity>
                                    {expandedMember === 'giovanni' && (
                                        <Text style={styles.memberText}>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                        </Text>
                                    )}

                                    {/* GUSTAVO */}
                                    <TouchableOpacity
                                        onPress={() => toggleMember('gustavo')}
                                        style={styles.memberButton}
                                    >
                                        <Text style={styles.memberName}>Gustavo Pietro de Assis Silva</Text>
                                    </TouchableOpacity>
                                    {expandedMember === 'gustavo' && (
                                        <Text style={styles.memberText}>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                        </Text>
                                    )}
                                </View>
                            )}

                           {/* RESULTADOS */}
                            {section.key === 'resultados' && (
                                <View>
                                    <Text style={styles.text}>
                                        Com o desenvolvimento e a utilização do aplicativo Memória Ativa, espera-se que os usuários apresentem 
                                        melhora na memória de curto e longo prazo, além de um aumento na atenção e no foco durante as atividades diárias.{"\n\n"}
                                        Também se prevê que as funcionalidades cognitivas propostas contribuam para reduzir os efeitos do estresse 
                                        na capacidade de concentração, promovendo uma experiência de treino mental que seja eficaz, acessível e agradável.{"\n\n"}
                                        Além disso, a aplicação servirá como uma ferramenta para avaliar a eficácia das atividades cognitivas implementadas, 
                                        permitindo ajustes e aprimoramentos baseados em dados coletados, contribuindo assim para uma melhoria contínua 
                                        na estimulação da memória e no bem-estar mental dos usuários.
                                    </Text>
                                </View>
                            )}

                        </View>
                    )}
                </View>
            ))}

            <View style={styles.spacer}>
                <LottieView
                    source={require('../../../assets/animations/run_memu.json')}
                    autoPlay
                    loop
                    style={styles.animation}
                />
            </View>

            <Text style={styles.version}>Versão 1.0.0</Text>
        </ScrollView>
    );
}
