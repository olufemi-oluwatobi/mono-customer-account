const invitationTemplate = ({ link, organisation }: { link: string, organisation: string }) => `<html><body><div> ${organisation} is inviting you to become a teammate, click to join <b>${link}</b></div></body></html>`

export default invitationTemplate