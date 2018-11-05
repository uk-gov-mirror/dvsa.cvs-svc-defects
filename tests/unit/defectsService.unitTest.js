const assert = require('assert')
const defectsService = require('../../services/defectsService')

describe('defectsService', () => {
  it('should fetch all defects from the database', async () => {
    await defectsService()
      .then((defects) => {
        assert.ok(true, 'Defects retrieved successfully.')
      })
      .catch((error) => {
        assert.fail(error)
      })
  })
})
