const supertest = require('supertest')
const expect = require('chai').expect
const url = 'http://localhost:3001/'
const request = supertest(url)
const DefectsService = require('../../src/services/DefectsService')
const DefectsDAO = require('../../src/models/DefectsDAO')

describe('defects', () => {
  describe('getDefects', () => {
    context('when database is populated', () => {
      let defectsService = null
      let defectsData = require('../resources/defects.json')
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
        request.get('defects')
          .end((err, res) => {
            console.log()
            if (err) { expect.fail(err) }
            expect(res.statusCode).to.equal(200)
            expect(res.headers['access-control-allow-origin']).to.equal('*')
            expect(res.headers['access-control-allow-credentials']).to.equal('true')
            expect(res.body.sort((a, b) => a.imNumber - b.imNumber)).to.eql(defectsData)
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
              return item.imNumber
            })
          )
        })

        done()
      })
    })

    context('when database is empty,', () => {
      it('should return error code 404', (done) => {
        request.get('defects').expect(404, done)
      })
    })
  })

  beforeEach((done) => {
    setTimeout(done, 500)
  })
  afterEach((done) => {
    setTimeout(done, 500)
  })
})
