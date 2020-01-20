function buildLists() {
  for (var i = 1; i <= 12; i++) {
    const listHolder = document.getElementById('activityList'+i);

    const list = document.createElement('ul');
    const title = document.createElement('h3');

    title.innerHTML = 'Atividades concluídas:';
    title.style.margin = '0px 0px 0px 1vw';
    listHolder.appendChild(title);

    for (var i2 = 0; i2 < activityList.length; i2++) {
      if (activityList[i2] != null) {
        const listItem = document.createElement('li');
        listItem.innerHTML = activityList[i2];
        listItem.id = 'li/'+i+'/'+i2;
        listItem.style.display = 'none';
        list.appendChild(listItem);
      }
    }

    listHolder.appendChild(list);
    listHolder.className = 'listHolder';
  }
}

var activityList = [];

activityList[0] = null;
activityList[1] = null
activityList[2] = null
activityList[3] = 'Doar cabelos';
activityList[4] = null
activityList[5] = 'Contar os degraus do prédio da PA';
activityList[6] = 'Vídeo cantando parabéns no RU';
activityList[7] = 'Ir até a pré-história';
activityList[8] = 'Encontrar a biblioteca do biológicas';
activityList[9] = 'Tirar foto com a ferradura do PET EQ';
activityList[10] =  'Visitar o FIBRA e tirar foto com algum experimento';
activityList[11] =  'Fazer o cadastro na biblioteca';
activityList[12] =  'Encontrar a CASA 3';
activityList[13] =  'Ir no auditório Gralha Azul';
activityList[14] =  'Encontrar as esferas do dragão no Sociais Aplicadas';
activityList[15] =  'Tirar foto da entrada ou fazer trilha da floresta';
activityList[16] =  'Achar o prédio da UFPR no MusA';
activityList[17] =  'Contar as janelas do prédio Rebouças';
activityList[18] =  'Revezamento de vídeo nas rampas do prédio D. Pedro I';
activityList[19] =  'Tirar uma selfie no intercampi';
activityList[20] =  'Encontrar o CA de Música';
activityList[21] =  'Fazer embaixadinhas no campo de futebol do SEPT';
activityList[22] =  'Medir a passarela entre o hall do ADM e a biblioteca com palito de fósforo';
activityList[23] =  'Tirar foto com a formanda Maria D. Barbosa';
activityList[24] =  'Contar quantos hidrantes tem no Espinha de Peixe';
activityList[25] =  'Abraçar 10 ou mais pessoas na fila do RU';
activityList[26] =  null
activityList[27] =  'Raspar o cabelo';

buildLists();
