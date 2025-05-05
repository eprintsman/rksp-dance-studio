import coach1 from './img/dotsenko.jpg';
import coach2 from './img/migel.jpg';
import coach3 from './img/tanya.webp';

const SocialLinks = {
    instagram: '#',
    facebook: '#',
    vk: '#',
    youtube: '#',
  }


export default [
    {
        id: 1,
        fio: 'Алиса Доценко',
        danceStyle: "вог, контемп",
        photo: coach1,
        description: "Участница проектов «Танцы без правил», «Танцуют все», «Танцы на ТНТ»",
        experience: 5,
        socialLinks: SocialLinks,
    },
    {
        id: 2,
        fio: 'Мигель',
        danceStyle: "High heeels",
        photo: coach2,
        description: "Хореограф с 12-летним опытом, специализирующийся на латиноамериканских танцах. Мастер сальсы, бачаты и ча-ча-ча. Участник мировых танцевальных чемпионатов, создатель авторской методики 'Ritmo Libre'. Его ученики — победители международных конкурсов. 'Танец — это язык тела, а я помогаю сделать его красноречивым'",
        experience: 12,
        socialLinks: SocialLinks,
    },
    {
        id: 3,
        fio: 'Татьяна Денисова',
        danceStyle: "танго, контемп",
        photo: coach3,
        description: "Украинская и российская хореограф, танцовщица, режиссёр-постановщик и телеведущая. Основательница танцевального театра JB Ballet в Германии, известная как строгий, но вдохновляющий наставник в шоу «Танцуют все!» (Украина) и «Танцы» (Россия) ",
        experience: 7,
        socialLinks: SocialLinks,
    }
];