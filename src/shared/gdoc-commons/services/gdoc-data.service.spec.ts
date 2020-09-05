/* tslint:disable:no-unused-variable */
import {GeoDocRecord} from '../model/records/gdoc-record';
import {GeoDocDataService} from './gdoc-data.service';
import {from, forkJoin} from 'rxjs';
import {GeoDocDataStore, GeoDocTeamFilterConfig} from './gdoc-data.store';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';

describe('GeoDocDataService', () => {
    let gdoc1: GeoDocRecord = undefined;
    let gdoc2: GeoDocRecord = undefined;
    let service: GeoDocDataService;

    beforeEach(() => {
        const datastore = new GeoDocDataStore(new SearchParameterUtils(), new GeoDocTeamFilterConfig());
        service = new GeoDocDataService(datastore);
        service.setWritable(true);
        gdoc1 = new GeoDocRecord({desc: '', name: 'Testgdoc1', persons: '', id: '1', type: 'image', subtype: '5'});
        gdoc2 = new GeoDocRecord({desc: '', name: 'Testgdoc2', persons: '', id: '2', type: 'image', subtype: '5'});
    });

    it('should ...', done => {
        // WHEN/THEN
        expect(service).toBeTruthy();
        done();
    });

    describe('#getAll()', () => {
        it('should return an empty array by default', done => {
            // WHEN
            from(service.getAll()).subscribe(
                gdocs => {
                    // THEN
                    expect(gdocs).toEqual([]);
                    done();
                },
                error => {
                    expect(error).toBeUndefined();
                    done();
                },
                () => {
                    done();
                }
            );
        });

        it('should return all gdocs', done => {
            // GIVEN
            forkJoin(
                service.addMany([gdoc1, gdoc2]),
                service.getAll()
            ).subscribe(
                results => {
                    // THEN: add GeoDocs
                    expect(results[0].toString()).toEqual([gdoc1, gdoc2].toString());
                    // THEN: get GeoDocs
                    expect(results[1].toString()).toEqual([gdoc1, gdoc2].toString());
                    done();
                },
                error => {
                    expect(error).toBeUndefined();
                    done();
                },
                () => {
                    done();
                }
            );
        });
    });
    describe('#save(record)', () => {

        it('should automatically assign an incrementing id', done => {
            // GIVEN
            forkJoin(
                service.addMany([gdoc1, gdoc2]),
                service.getById('1'),
                service.getById('2')
            ).subscribe(
                results => {
                    // THEN: add GeoDocs
                    expect(results[0].toString()).toEqual([gdoc1, gdoc2].toString());
                    // THEN: get GeoDocs
                    expect(results[1].toString()).toEqual(gdoc1.toString());
                    expect(results[2].toString()).toEqual(gdoc2.toString());
                    done();
                },
                error => {
                    expect(error).toBeUndefined();
                    done();
                },
                () => {
                    done();
                }
            );
        });

    });

    describe('#deleteById(id)', () => {

        it('should remove record with the corresponding id', done => {
            forkJoin(
                service.addMany([gdoc1, gdoc2]),
                service.getAll(),
                service.deleteById('1'),
                service.getAll(),
                service.deleteById('2'),
                service.getAll()
            ).subscribe(
                results => {
                    // THEN: add GeoDocs
                    expect(results[0].toString()).toEqual([gdoc1, gdoc2].toString());
                    expect(results[1].toString()).toEqual([gdoc1, gdoc2].toString());
                    // THEN: get GeoDocs
                    expect(results[2]).toEqual(gdoc1);
                    expect(results[3].toString()).toEqual([gdoc2].toString());
                    expect(results[4]).toEqual(gdoc2);
                    expect(results[5].toString()).toEqual([].toString());
                    done();
                },
                error => {
                    expect(error).toBeUndefined();
                    done();
                },
                () => {
                    done();
                }
            );
        });

        it('should not removing anything if record with corresponding id is not found', done => {
            forkJoin(
                service.addMany([gdoc1, gdoc2]),
                service.getAll(),
                service.deleteById('3'),
                service.getAll()
            ).subscribe(
                results => {
                    // THEN: add GeoDocs
                    expect(results[0].toString()).toEqual([gdoc1, gdoc2].toString());
                    expect(results[1].toString()).toEqual([gdoc1, gdoc2].toString());
                    // THEN: get GeoDocs
                    expect(results[2]).toEqual(undefined);
                    expect(results[3].toString()).toEqual([gdoc1, gdoc2].toString());
                    done();
                },
                error => {
                    expect(error).toBeUndefined();
                    done();
                },
                () => {
                    done();
                }
            );
        });

    });
    describe('#updateById(id, values)', () => {

        it('should return record with the corresponding id and updated data', done => {
            forkJoin(
                service.addMany([gdoc1, gdoc2]),
                service.getAll(),
                service.updateById('1', {
                    id: '1', name: 'new name', type: 'image', subtype: '5'
                }),
                service.getById('1')
            ).subscribe(
                results => {
                    // THEN: add GeoDocs
                    expect(results[0].toString()).toEqual([gdoc1, gdoc2].toString());
                    expect(results[1].toString()).toEqual([gdoc1, gdoc2].toString());
                    // THEN: get GeoDocs
                    expect(results[2].name).toEqual('new name');
                    expect(results[3].name).toEqual('new name');
                    done();
                },
                error => {
                    expect(error).toBeUndefined();
                    done();
                },
                () => {
                    done();
                }
            );
        });

        it('should return null if record is not found', done => {
            forkJoin(
                service.addMany([gdoc1, gdoc2]),
                service.getAll(),
                service.updateById('26', {
                    id: '26', name: 'new name', type: 'image', subtype: '5'
                }),
                service.getById('26')
            ).subscribe(
                results => {
                    // THEN: add GeoDocs
                    expect(results[0].toString()).toEqual([gdoc1, gdoc2].toString());
                    expect(results[1].toString()).toEqual([gdoc1, gdoc2].toString());
                    // THEN: get GeoDocs
                    expect(results[2]).toEqual(null);
                    expect(results[3]).toEqual(undefined);
                    done();
                },
                error => {
                    expect(error).toBeUndefined();
                    done();
                },
                () => {
                    done();
                }
            );
        });
    });
});
