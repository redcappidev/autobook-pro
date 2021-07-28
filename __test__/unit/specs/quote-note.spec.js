describe('Quote note Test Cases', () => {
  describe('Non-authenticated', () => {
    test('Get notes: Not allowed', async () => { });

    test('Create a note: Not allowed', async () => { });
  });

  describe('Authenticated as admin', () => {
    test('Create note A in quote A: Success', async () => { });

    test('Get assigness who have permissions to view a note', async () => { });

    test('Assign note A to user A: Success', async () => { });

    test('User A views note A: Success', async () => { });
  });

  describe('Authenticated but has necessary permissions missing', () => {
    test('(No permissions to view notes) View a note: Not allowed', async () => { });

    test('(No permissions to create a note) Create note A in quote A: Not allowed', async () => { });

    test('(No permissions to delete a note) Delete note A: Not allowed', async () => { });
  });
});
