module.exports = {
	selectTicketCount: function (user_id) {
		return `SELECT count(*) as count
                    FROM tickets
                      WHERE user_id LIKE '${user_id}';`;
	},

	selectUserIdForTickets: function (user_id) {
		return `SELECT user_id
              FROM users
                JOIN tickets
                 ON users.id = tickets.user_id
                    WHERE user_id = '${user_id}'
                         LIMIT 1;`;
	},

	selectTickets: function () {
		return `SELECT tickets.id, product, description, status,
              added_date AS ticket_added_date
                  FROM tickets
                    JOIN users
                      ON tickets.user_id = users.id
                        WHERE 
                           user_id = ?
                            ORDER BY added_date ASC;`;
	},

	selectTicket: function () {
		return `SELECT tickets.id, product, description, status,
              added_date AS ticket_added_date
                  FROM tickets
                    JOIN users
                      ON tickets.user_id = users.id
                        WHERE 
                           tickets.id = ? AND tickets.user_id = ?
                            LIMIT 1;`;
	},

	insertTicket: function () {
		return `INSERT INTO tickets (user_id, product, description)
              VALUES (?, ?, ?);`;
	},

	deleteTicket: function () {
		return `DELETE 
              FROM tickets
                WHERE tickets.id = ? AND tickets.user_id = ?
                  LIMIT 1;`;
	},
	updateTicket: function () {
		return `UPDATE tickets
              SET status = 'Closed'
                WHERE 
                   tickets.id = ? AND tickets.user_id = ?
                    LIMIT 1;`;
	},
};
