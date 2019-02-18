const supertest = require('supertest')
const expect = require('chai').expect
const fs = require('fs')
const path = require('path')
const url = 'http://localhost:3001/'
const request = supertest(url)
const DefectsService = require('../../src/services/DefectsService')
const DefectsDAO = require('../../src/models/DefectsDAO')

describe('defects', () => {
  describe('getDefects', () => {
    context('when database is populated', () => {
      let defectsService = null
      const defectsData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../resources/defects.json'), 'utf8'))
      let defectsDAO = null

      before((done) => {
        defectsDAO = new DefectsDAO()
        defectsService = new DefectsService(defectsDAO)
        let mockBuffer = defectsData.slice()

        let batches = []
        while (mockBuffer.length > 0) {
          batches.push(mockBuffer.splice(0, 25))
        }

        batches.forEach((batch) => {
          defectsService.insertDefectList(batch)
        })

        done()
      })

      it('should return all defects in the database', (done) => {
        let expectedResponse = JSON.parse(JSON.stringify(defectsData)).map((defect) => {
          delete defect.id
          return defect
        })
          .sort((first, second) => first.imNumber - second.imNumber)

        request.get('defects')
          .end((err, res) => {
            console.log()
            if (err) { expect.fail(err) }
            expect(res.statusCode).to.equal(200)
            expect(res.headers['access-control-allow-origin']).to.equal('*')
            expect(res.headers['access-control-allow-credentials']).to.equal('true')
            expect(res.body.length).to.equal(expectedResponse.length)
            done()
          })
      })

      after((done) => {
        let dataBuffer = defectsData

        let batches = []
        while (dataBuffer.length > 0) {
          batches.push(dataBuffer.splice(0, 25))
        }

        batches.forEach((batch) => {
          defectsService.deleteDefectList(
            batch.map((item) => {
              return item.id
            })
          )
        })

        done()
      })
    })
  })

  context('when database is empty', () => {
    it('should return error code 404', (done) => {
      request.get('defects').expect(404, done)
    })
  })

  beforeEach((done) => {
    setTimeout(done, 500)
  })
  afterEach((done) => {
    setTimeout(done, 500)
  })
})
