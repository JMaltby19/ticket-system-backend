module.exports = {
	selectNotes: function () {
		return `SELECT notes.id, ticket_id, notes.user_id, note,
              notes.added_date AS note_added_date
                  FROM notes
                    JOIN tickets
                      ON notes.ticket_id = tickets.id
                        WHERE 
                           notes.ticket_id = ?  AND tickets.user_id = ?
                            ORDER BY notes.added_date ASC;`;
	},

	insertNote: function () {
		return `INSERT INTO notes (ticket_id, user_id, note)
              VALUES (?, ?, ?);`;
	},
};
