CREATE DATABASE  IF NOT EXISTS hospital_management;
USE hospital_management;

# drop tables with old values if they exist
SET FOREIGN_KEY_CHECKS=0;
drop table if exists specjalizacja;
drop table if exists funkcja;
drop table if exists pracownik;
drop table if exists lekarz;
drop table if exists personel;
drop table if exists oddzial;
drop table if exists pokoj;
drop table if exists pacjent;
drop table if exists urlop;
drop table if exists typ_operacji;
drop table if exists charakter_wizyty;
drop table if exists wizyta;
SET FOREIGN_KEY_CHECKS=1;

# create new tables
create table specjalizacja (
                               nazwa varchar(100) not null,
                               primary key (nazwa)
) DEFAULT charset=utf8 COLLATE utf8_unicode_ci;

create table funkcja (
                         nazwa  varchar(100) not null,
                         primary key (nazwa)
) DEFAULT charset=utf8 COLLATE utf8_unicode_ci;

create table pracownik (
                           id integer not null auto_increment,
                           name varchar(100) not null,
                           surname varchar(100) not null,
                           typ varchar(100),
                           primary key (id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT charset=utf8 COLLATE utf8_unicode_ci;

create table lekarz (
                        id integer not null,
                        specjalizacja varchar(100) not null,
                        primary key (id, specjalizacja)
) DEFAULT charset=utf8 COLLATE utf8_unicode_ci;

alter table lekarz add constraint doctor_fk_id foreign key (id) references pracownik (id);
alter table lekarz add constraint doctor_fk_specjalizacja foreign key (specjalizacja) references specjalizacja (nazwa);

create table personel (
                          id integer not null,
                          funkcja varchar(100) not null,
                          primary key (id, funkcja)

) DEFAULT charset=utf8 COLLATE utf8_unicode_ci;

alter table personel add constraint staff_fk_id foreign key (id) references pracownik (id);
alter table personel add constraint staff_fk_funkcja foreign key (funkcja) references funkcja (nazwa);

create table oddzial (
                         nazwa varchar(100) not null,
                         primary key (nazwa)
) DEFAULT charset=utf8 COLLATE utf8_unicode_ci;

create table pokoj (
                       id integer not null auto_increment,
                       numer integer not null,
                       nazwa_oddzialu varchar(100) not null,
                       primary key (id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT charset=utf8 COLLATE utf8_unicode_ci;

alter table pokoj add constraint room_fk_nazwa_oddzialu foreign key (nazwa_oddzialu) references oddzial (nazwa);
alter table pokoj add constraint room_u_1 unique(numer, nazwa_oddzialu);

create table pacjent (
                         pesel varchar(100) not null,
                         imie varchar(100) not null,
                         nazwisko varchar(100) not null,
                         primary key (pesel)
) DEFAULT charset=utf8 COLLATE utf8_unicode_ci;

create table urlop (
                       start_date varchar(100) not null,
                       end_date varchar(100) not null,
                       id_pracownika integer not null,
                       primary  key (id_pracownika, start_date)
) DEFAULT charset=utf8 COLLATE utf8_unicode_ci;

alter table urlop add constraint leave_of_absence_fk_id foreign key (id_pracownika) references pracownik (id);

create table typ_operacji (
                              typ varchar(100) not null,
                              primary key(typ)
) DEFAULT charset=utf8 COLLATE utf8_unicode_ci;

create table charakter_wizyty (
                                  charakter varchar(100) not null,
                                  primary key(charakter)
) DEFAULT charset=utf8 COLLATE utf8_unicode_ci;

create table wizyta (
                        data_poczatku varchar(100) not null,
                        data_konca varchar(100) not null,
                        pesel_pacjenta varchar(100) not null,
                        id_lekarza integer not null,
                        pokoj integer not null,
                        charakter_wizyty varchar(100) not null,
                        typ_operacji varchar(100),
                        primary key (data_poczatku, pesel_pacjenta)
) DEFAULT charset=utf8 COLLATE utf8_unicode_ci;

alter table wizyta add constraint visit_fk_patient_pesel foreign key (pesel_pacjenta) references pacjent(pesel);
alter table wizyta add constraint visit_fk_patient_doctor_id foreign key (id_lekarza) references lekarz(id);
alter table wizyta add constraint visit_fk_patient_room_number foreign key (pokoj) references pokoj(id);
alter table wizyta add constraint visit_fk_patient_character_of_visit foreign key (charakter_wizyty) references charakter_wizyty(charakter);
alter table wizyta add constraint visit_fk_patient_type_of_operation foreign key (typ_operacji) references typ_operacji(typ);

# fill new tables with values

insert into specjalizacja(nazwa) values ('chirurgia');
insert into specjalizacja(nazwa) values ('pediatria');
insert into specjalizacja(nazwa) values ('kardiochirurgia');
insert into specjalizacja(nazwa) values ('dermatologia');
insert into specjalizacja(nazwa) values ('neurologia');
insert into specjalizacja(nazwa) values ('okulistyka');
insert into specjalizacja(nazwa) values ('urologia');

insert into funkcja(nazwa) values ('pielęgniarka');
insert into funkcja(nazwa) values ('sprzątaczka');
insert into funkcja(nazwa) values ('recepcjonistka');
insert into funkcja(nazwa) values ('anestezjolog');

insert into pracownik(name, surname, typ) values ('Jan', 'Kowalski', 'lekarz');
insert into pracownik(name, surname, typ) values ('Franciszek', 'Piekarz', 'lekarz');
insert into pracownik(name, surname, typ) values ('Kamila', 'Sikorska', 'lekarz');
insert into pracownik(name, surname, typ) values ('Zbigniew', 'Ratajski', 'personel');
insert into pracownik(name, surname, typ) values ('Julia', 'Skrzypczak', 'personel');
insert into pracownik(name, surname, typ) values ('Zuzanna', 'Skrzypczak', 'personel');

insert into lekarz(id, specjalizacja) values (1, 'neurologia');
insert into lekarz(id, specjalizacja) values (2, 'okulistyka');
insert into lekarz(id, specjalizacja) values (3, 'dermatologia');

insert into personel(id, funkcja) values (4, 'anestezjolog');
insert into personel(id, funkcja) values (5, 'sprzątaczka');
insert into personel(id, funkcja) values (6, 'recepcjonistka');

insert into oddzial(nazwa) values ('oddzial chirurgiczny');
insert into oddzial(nazwa) values ('oddzial pediatryczny');
insert into oddzial(nazwa) values ('oddzial okulistyczny');
insert into oddzial(nazwa) values ('oddzial ginekologiczny');
insert into oddzial(nazwa) values ('oddzial rehabilitacji');
insert into oddzial(nazwa) values ('oddzial onkologiczny');

insert into pokoj(numer, nazwa_oddzialu) values (1, 'oddzial chirurgiczny');
insert into pokoj(numer, nazwa_oddzialu) values (2, 'oddzial chirurgiczny');
insert into pokoj(numer, nazwa_oddzialu) values (3, 'oddzial chirurgiczny');
insert into pokoj(numer, nazwa_oddzialu) values (1, 'oddzial pediatryczny');
insert into pokoj(numer, nazwa_oddzialu) values (2, 'oddzial pediatryczny');
insert into pokoj(numer, nazwa_oddzialu) values (3, 'oddzial pediatryczny');
insert into pokoj(numer, nazwa_oddzialu) values (1, 'oddzial okulistyczny');
insert into pokoj(numer, nazwa_oddzialu) values (2, 'oddzial okulistyczny');
insert into pokoj(numer, nazwa_oddzialu) values (3, 'oddzial okulistyczny');
insert into pokoj(numer, nazwa_oddzialu) values (1, 'oddzial ginekologiczny');
insert into pokoj(numer, nazwa_oddzialu) values (2, 'oddzial ginekologiczny');
insert into pokoj(numer, nazwa_oddzialu) values (3, 'oddzial ginekologiczny');
insert into pokoj(numer, nazwa_oddzialu) values (1, 'oddzial rehabilitacji');
insert into pokoj(numer, nazwa_oddzialu) values (2, 'oddzial rehabilitacji');
insert into pokoj(numer, nazwa_oddzialu) values (3, 'oddzial rehabilitacji');

insert into pacjent(pesel, imie, nazwisko) VALUES ('57060734835', 'Wojciech', 'Młynarski');
insert into pacjent(pesel, imie, nazwisko) VALUES ('92051246964', 'Maciej', 'Musiał');
insert into pacjent(pesel, imie, nazwisko) VALUES ('64092774485', 'Konstanty', 'Malinowski');

insert into urlop(start_date, end_date, id_pracownika) VALUES (current_date, date_add(current_date, interval 7 day),1);

insert into typ_operacji(typ) values ('serca');
insert into typ_operacji(typ) values ('kolana');
insert into typ_operacji(typ) values ('oczu');
insert into typ_operacji(typ) values ('mózgu');
insert into typ_operacji(typ) values ('nowotworowa');

insert into charakter_wizyty(charakter) values ('konsultacja');
insert into charakter_wizyty(charakter) values ('wizyta');
insert into charakter_wizyty(charakter) values ('usg');
insert into charakter_wizyty(charakter) values ('operacja');

insert into wizyta(data_poczatku, data_konca, pesel_pacjenta, id_lekarza, pokoj, charakter_wizyty)
VALUES (current_date, date_add(current_date , interval 1 hour), '64092774485', 3, 4, 'wizyta');






