import { Readable } from 'stream';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { pairDto } from './dto'

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;
  let mockStore: Record<string, string>;
  let mockStoreValues: string[];

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appService = moduleRef.get<AppService>(AppService)
    appController = moduleRef.get<AppController>(AppController);
    mockStore = {
      "one": "1",
      "two": "2",
      "three": "3"
    };
    mockStoreValues = ["1", "2", "3"];
  });

  describe('findAll', () => {
    it('should return a list of values', async () => {
      jest.spyOn(appService, 'findAll').mockImplementation(() => Object.values(mockStore));
      expect(appController.findAll()).toStrictEqual(mockStoreValues);
    })
  })

  describe('find', () => {
    it('should return a value', async () => {
      const result = mockStore['one'];
      jest.spyOn(appService, 'find').mockImplementation(() => result);
      expect(appController.find('one')).toBe(result);
    })
  })

  describe('storePairs', () => {
    it('should add the pairs to the store and return what was added', async () => {
      const pairs: pairDto[] = [
        {key: 'four', value: '4'},
        {key: 'five', value: '5'},
        {key: 'three', value: 'tres'}
      ]

      jest.spyOn(appService, 'storePairs').mockImplementation((pairs: pairDto[]) => {
        pairs.forEach(pair => mockStore[pair.key] = pair.value)
      })
      expect(appController.storePairs(pairs)).toBe(pairs);
      expect(mockStore['four']).toBe('4');
      expect(mockStore['five']).toBe('5');
      expect(mockStore['three']).toBe('tres');
    })
  })

  describe('deletePair', () => {
    it('should delete the pair of the given key from the store and return the key that was deleted', async () => {
      const result = 'DELETED pair with key: "three"'
      jest.spyOn(appService, 'deletePair').mockImplementation((key: string) => {
        delete mockStore[key]
        return true
      })
      expect(appController.deletePair('three')).toBe(result)
      expect(mockStore['three']).toBe(undefined)
    })
  })
});
