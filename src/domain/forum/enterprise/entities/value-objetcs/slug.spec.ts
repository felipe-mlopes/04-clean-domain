import { Slug } from './slug'

test('it should be able to create a new slug from text', async () => {
  const slug = Slug.createFormText('Example question title')

  expect(slug.value).toBe('example-question-title')
})
