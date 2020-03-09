export function getProfileUrl(profile) {
    if (profile.handle) {
        return "/profile/h/" + profile.handle;
    }
    return "/profile/i/" + profile._id;
}

export function getProjectUrl(project) {
    if (project.handle) {
        return "/project/h/" + project.handle;
    }
    return "/project/i/" + project._id;
}