const warnings = new Map();

function addWarning(member) {
    const userId = member.id;

    let userWarnings = warnings.get(userId) || 0;
    userWarnings++;

    warnings.set(userId, userWarnings);

    return userWarnings;
}

function resetWarnings(member) {
    warnings.delete(member.id);
}

module.exports = {
    addWarning,
    resetWarnings
};
